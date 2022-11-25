const knex = require('knex')
const config = require('./knexfile')
const testConn = knex(config.test)
export default testConn
