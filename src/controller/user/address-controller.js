import addressService from '../../service/user/address-service.js'

const addAddress = async (req, res, next) => {
	try{
		const result = await addressService.addAddress(req.user.id, req.body)

		res.status(200).json({
			message: 'Tambah alamat sukses'
		})
	}catch(e){
		next(e)
	}
}

const getAddress = async (req, res, next) => {
	try{
		const result = await addressService.getAddress(req.user.id)

		res.status(200).json({
			data: result
		})
	}catch(e){
		next(e)
	}
}

const getAddressBookmarked = async (req, res, next) => {
	try{
		const result = await addressService.getAddressBookmarked(req.user.id, req.params.id)

		res.status(200).json({
			data: result
		})
	}catch(e){
		next(e)
	}
}

const updateAddress = async (req, res, next) => {
	try{
		const result = await addressService.updateAddress(req.user.id, req.params.id, req.body)

		res.status(200).json({
			message: 'Edit alamat sukses'
		})
	}catch(e){
		next(e)
	}
}

const deleteAddress = async (req, res, next) => {
	try{
		const result = await addressService.deleteAddress(req.user.id, req.params.id)

		res.status(200).json({
			message: 'Hapus alamat sukses'
		})
	}catch(e){
		next(e)
	}
}

const bookmarkAddress = async (req, res, next) => {
	try{
		const result = await addressService.bookmarkAddress(req.user.id, req.params.id)

		res.status(200).json({
			message: 'Bookmark alamat sukses'
		})
	}catch(e){
		next(e)
	}
}

export default {
	addAddress,
	getAddress,
	getAddressBookmarked,
	updateAddress,
	deleteAddress,
	bookmarkAddress
}