import {app} from './application/app.js'
import {logger} from './application/logger.js'

// app.listen(3000, () => {
app.listen(3000, '0.0.0.0', () => {
	logger.info('App start')
})