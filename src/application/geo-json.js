import * as turf from '@turf/turf'
import {readFile} from 'fs/promises'
const geoJsonCity = await readFile('./public/all_kabkota_ind.geojson')
const mapDataCity = JSON.parse(geoJsonCity)

const getAddressWithCoordinate = async (coordinate) => {
	console.log(coordinate)
	const point = turf.point([coordinate.lng, coordinate.lat])
	console.log('POINT :')
	console.log(point)

	let result = null

	for(const data of mapDataCity.features){
		if(turf.booleanPointInPolygon(point, data)){
			const prop = data.properties
			result = {
				id_prov: parseInt(prop.province_id),
				id_city: parseInt(prop.province_id+prop.kabkot_id),
				id_subd: 350712
			}
			break
		}
	}

	return result
}

export {getAddressWithCoordinate}