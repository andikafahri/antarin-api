import {server} from './application/app.js'
import {logger} from './application/logger.js'

// server.listen(3000, () => {
server.listen(3000, '0.0.0.0', () => {
	logger.info('App start')
})