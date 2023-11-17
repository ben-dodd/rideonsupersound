import knex from 'knex'
import config from './knexfile'
const testConn = knex(config.test)
export default testConn
