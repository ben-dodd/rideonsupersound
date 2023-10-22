import knex from 'knex'
import config from './knexfile'

const env = process.env.NODE_ENV || 'development'

const registerService = (name, initFn) => {
  if (process.env.NODE_ENV === 'development') {
    if (!(name in global)) {
      global[name] = initFn()
    }
    return global[name]
  }
  return initFn()
}

const connection = registerService('db', () => knex(config[env]))

export default connection

// module.exports = connection
