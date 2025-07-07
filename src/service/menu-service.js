import multer from 'multer'
import cloudinary from '../middleware/cloudinary.js'
import path from 'path'
import {dirname} from 'path'
import {fileURLToPath} from 'url'
import fs from 'fs'
import {promises as fsPromises} from 'fs'
import {validate} from '../validation/validation.js'
import {
	// createMenuValidation,
	createMenuWithVariantValidation,
	getListMenuValidation,
	// updateMenuValidation
	updateMenuWithVariantValidation
} from '../validation/menu-validation.js'
import {prismaClient} from '../application/database.js'
import {ErrorResponse} from '../application/error-response.js'
import uniqid from 'uniqid'
import {logger} from '../application/logger.js'

const uploadImage = async (id_merchant, file) => {
	console.log('Uploading file at:', file.path, 'Size:', file.size, 'Type:', file.mimetype)

	if(!file){
		throw new ErrorResponse(400, 'Gambar tidak boleh kosong')
	}

	const filePath = file.path
	// try{
	// 	await fs.access(filePath)
	// }catch(error){
	// 	throw new ErrorResponse(500, 'File belum tersedia untuk diupload')
	// }

	try{

		const result = await cloudinary.uploader.upload(filePath, {
			folder: 'merchant/'+id_merchant,
			// folder: path.join('merchant/', id_merchant),
			// public_id: Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname),
			public_id: Date.now() + '-' + Math.round(Math.random() * 1E9),
			resource_type: 'image'
		})

		fs.unlinkSync(filePath)

		return result.secure_url
	}catch(error){
		console.log(error)
		if(fs.existsSync(filePath)){
			fs.unlinkSync(filePath)
		}
		throw new ErrorResponse(500, error.error.message || 'Upload image failed')
	}
}

const deleteImage = async (imageUrl) => {
	try{
		if(imageUrl && imageUrl.startsWith('https://res.cloudinary.com/')){
			const urlObj = new URL(imageUrl)
			const pathUrl = urlObj.pathname
			const parts = pathUrl.split('/')
			const fileName = parts.pop().split('.')[0]
			const folder = parts.slice(5).join('/')
			const file = `${folder}/${fileName}`
			console.log('FILE: '+file)
			
			const result = await cloudinary.uploader.destroy(file, {
				resource_type: 'image'
			})

			console.log(result)
			return result
		}
	}catch(error){
		console.log(error)
		throw new ErrorResponse(500, error.error.message || 'Delete image failed')
	}
}

const deleteImageOLD = async (id_merchant, filename) => {
	const __filename = fileURLToPath(import.meta.url)
	const __dirname = dirname(__filename)
	const imagePath = path.join(__dirname, '../../public/uploads/images/merchant', id_merchant, filename)

	if(fs.existsSync(imagePath)){
		await fsPromises.unlink(imagePath)
	}
}

const checkMenu = async (id, id_merchant) => {
	const result = await prismaClient.menu.findFirst({
		where: {
			id: id,
			id_merchant: id_merchant
		}
		// select: {
		// 	name: true
		// }
	})

	if(!result){
		throw new ErrorResponse(404, 'Menu not found')
	}

	return result
}

const checkCategory = async (id_category) => {
	const result = await prismaClient.category.findUnique({
		where: {
			id: id_category
		},
		select: {
			name: true
		}
	})

	if(!result){
		throw new ErrorResponse(404, 'Kategori not found')
	}
}

const checkVariant = async (id_variant, id_menu) => {
	const result = await prismaClient.variant.findFirst({
		where: {
			id: id_variant,
			id_menu: id_menu
		},
		select: {
			name: true
		}
	})

	if(!result){
		throw new ErrorResponse(404, 'Variant not found')
	}
}

const checkVariantItem = async (id_item, id_variant) => {
	const result = await prismaClient.variant_item.findFirst({
		where: {
			id: id_item,
			id_variant: id_variant
		},
		select: {
			name: true
		}
	})

	if(!result){
		throw new ErrorResponse(404, 'Item varian not found')
	}
}

// const createMenuwithVariant = async (id_merchant, filename, request) => {
const createMenuwithVariant = async (id_merchant, file, request) => {
	// return request
	const req = validate(createMenuWithVariantValidation, request)

	// if(!filename){
	// 	throw new ErrorResponse(400, 'Gambar tidak boleh kosong')
	// }

	await checkCategory(req.id_category)

	if(req.variants && req.variants.length > 1){
		throw new ErrorResponse(400, 'Kamu hanya bisa menambahkan 1 kategori varian')
	}

	const imageUrl = await uploadImage(id_merchant, file)
	// const imageUrl = 'test'

	const idMenu = uniqid()

	const result = await prismaClient.$transaction(async (tx) => {
		await tx.menu.create({
			data: {
				id: idMenu,
				name: req.name,
				detail: req.detail,
				id_category: req.id_category,
				price: req.price,
				is_ready: req.is_ready,
				id_merchant: id_merchant,
				// image: filename
				image: imageUrl
			},
			select: {
				name: true
			}
		})

		for (const variant of req.variants) {
			const idVariant = uniqid()

			await tx.variant.create({
				data: {
					id: idVariant,
					name: variant.name,
					id_menu: idMenu
				},
				select: {
					name: true
				}
			})

			const itemData = variant.items.map((item) => ({
				id: uniqid(),
				name: item.name,
				id_variant: idVariant,
				price: item.price,
				is_ready: item.is_ready
			}))

			await tx.variant_item.createMany({
				data: itemData
			})
		}
	})

	console.log(result)
	return result
}

const getList = async (id_merchant, filterQuery) => {
	id_merchant = validate(getListMenuValidation, id_merchant)

	const allowedQuery = ['search', 'category']
	const isValidQuery = Object.keys(filterQuery || {}).every(key => allowedQuery.includes(key))

	if(!isValidQuery){
		return []
	}

	const filter = {}

	if(filterQuery.search){
		filter.search = filterQuery.search.toLowerCase()
	}

	if(filterQuery.category){
		filter.category = Number(filterQuery.category)
	}

	const data = await prismaClient.menu.findMany({
		where: {
			id_merchant: id_merchant,
			name: {
				contains: filter.search
			},
			rel_category: {
				id: filter.category
			}
		},
		select: {
			id: true,
			name: true,
			detail: true,
			price: true,
			image: true,
			is_ready: true,
			rel_variant:{
				select: {
					id: true,
					name: true,
					rel_variant_item: {
						select: {
							id: true,
							name: true,
							price: true,
							is_ready: true
						}
					}
				}
			},
			rel_category: {
				select: {
					id: true,
					name: true
				}
			}
		}
	})

	if(!data){
		throw new ErrorResponse(404, 'Merchant not found')
	}

	const list = data.map(item => {
		const newItem = {
			...item,
			// variants: item.rel_variant ? [{
			// 	id: item.rel_variant.id,
			// 	name: item.rel_variant.name,
			// 	items: item.rel_variant.rel_variant_item || []
			// }] : [],
			variants: item.rel_variant.map(v => ({
				id: v.id,
				name: v.name,
				items: v.rel_variant_item || null
			})) || null,
			category: item.rel_category || null
		}
		delete newItem.rel_variant
		delete newItem.rel_category
		return newItem
	})

	// const list = data.map(item => ({
	// 	id: item.id,
	// 	name: item.name,
	// 	price: item.price,
	// 	category: item.rel_category,
	// 	is_ready: item.is_ready
	// }))

	return list
}

const getCurrentWithVariant = async (id, id_merchant) => {
	const data = await prismaClient.menu.findFirst({
		where: {
			id: id,
			id_merchant: id_merchant
		},
		select: {
			name: true,
			detail: true,
			id_category: true,
			price: true,
			is_ready: true,
			rel_variant: {
				select: {
					id: true,
					name: true,
					rel_variant_item: {
						select: {
							id: true,
							name: true,
							price: true
						}
					}
				}
			}
		}
	})

	if(!data){
		throw new ErrorResponse(404, 'Menu not found')
	}

	const result = {
		...data,
		variants: (data.rel_variant || []).map(variant => ({
			id: variant.id,
			name: variant.name,
			items: variant.rel_variant_item
		}))
	}
	delete result.rel_variant
	delete result.rel_variant_item

	return result
}

// const updateWithVariant = async (id, id_merchant, filename, request) => {
const updateWithVariant = async (id, id_merchant, file, request) => {
	if(request.variants.length > 1){
		throw new ErrorResponse(400, 'Kamu hanya boleh memiliki 1 kategori varian')
	}

	const req = validate(updateMenuWithVariantValidation, request)

	const oldData = await checkMenu(id, id_merchant)
	await checkCategory(req.id_category)

	const newData = {
		name: req.name,
		detail: req.detail,
		id_category: req.id_category,
		price: req.price,
		is_ready: req.is_ready,
		update_at: new Date()
	}

	if(file){
		const imageUrl = await uploadImage(id_merchant, file)
		newData.image = imageUrl
	}

	const reqVariant = req.variants || []

	const result = await prismaClient.$transaction(async (tx) => {
		await tx.menu.update({
			where: {
				id: id,
				id_merchant: id_merchant
			},
			// data: {
			// 	name: req.name,
			// 	detail: req.detail,
			// 	id_category: req.id_category,
			// 	price: req.price,
			// 	is_ready: req.is_ready,
			// 	image: imageUrl,
			// 	update_at: new Date()
			// },
			data: newData,
			select: {
				name: true
			}
		})

		const findVariant = await tx.variant.findMany({
			where: {
				id_menu: id
			},
			select: {
				id: true
			}
		})
		const variantInDb = findVariant.map(v => v.id)
		const incomingVariant = reqVariant.filter(v => v.id).map(v => v.id)
		const deleteVariant = variantInDb.filter(id_variant => !incomingVariant.includes(id_variant))
		if(deleteVariant.length > 0){
			await tx.variant.deleteMany({
				where: {
					id: {
						in: deleteVariant
					},
					id_menu: id
				}
			})
		}

		for(const variant of reqVariant){
			if(!variant.id){
				await tx.variant.create({
					data: {
						id: uniqid(),
						name: variant.name,
						id_menu: id,
						rel_variant_item: {
							create: variant.items.map(item => ({
								id: uniqid(),
								name: item.name,
								price: item.price
							}))
						}
					}
				})
			}else{
				await checkVariant(variant.id, id)
				await tx.variant.update({
					where: {
						id: variant.id,
						id_menu: id
					},
					data: {
						name: variant.name,
						update_at: new Date()
					}
				})

				await Promise.all(
					variant.items.filter(i => i.id).map(async i => {
						await checkVariantItem(i.id, variant.id)
						return tx.variant_item.update({
							where: {
								id: i.id,
								id_variant: variant.id
							},
							data: {
								name: i.name,
								price: i.price,
								is_ready: i.is_ready,
								update_at: new Date()
							}
						})
					})
					)

				const findItem = await tx.variant_item.findMany({
					where: {
						id_variant: variant.id
					},
					select: {
						id: true
					}
				})
				const itemInDb = findItem.map(i => i.id)
				const incomingItem = variant.items.filter(i => i.id).map(i => i.id)
				const deleteItem = itemInDb.filter(id_item => !incomingItem.includes(id_item))
				if(deleteItem.length > 0){	
					await tx.variant_item.deleteMany({
						where: {
							id: {
								in: deleteItem
							}
						}
					})
				}

				await tx.variant_item.createMany({
					data: variant.items.filter(i => !i.id).map(i => ({
						id: uniqid(),
						name: i.name,
						price: i.price,
						id_variant: variant.id
					}))
				})
			}
		}
	})

	if(file){
		await deleteImage(oldData.image)
	}

	return result
}

const remove = async (id, id_merchant) => {
	await checkMenu(id, id_merchant)

	const dataDeleted = await prismaClient.menu.findUnique({
		where: {
			id: id
		}
	})

	// if(dataDeleted.image){
	// 	await deleteImageOLD(id_merchant, dataDeleted.image)
	// }

	if(dataDeleted.image){
		console.log(dataDeleted.image)
		await deleteImage(dataDeleted.image)
	}

	const result = await prismaClient.menu.delete({
		where: {
			id: id
		}
	})
	// const result = 'ok'

	return result
}

const getCategory = async () => {
	return prismaClient.category.findMany({
		select: {
			id: true,
			name: true
		}
	})
}

export default {
	createMenuwithVariant,
	getList,
	getCurrentWithVariant,
	updateWithVariant,
	remove,
	getCategory
}