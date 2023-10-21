// import { Knex } from "knex"
// const { Knex } = require('knex')
const path = require('path')
// Update with your config settings.

const cf = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.MYSQL_DEV_HOST,
      port: Number(process.env.MYSQL_DEV_PORT),
      user: process.env.MYSQL_DEV_USERNAME,
      password: process.env.MYSQL_DEV_PASSWORD,
      database: process.env.MYSQL_DEV_DATABASE,
    },
  },

  production: {
    client: 'mysql',
    connection: {
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },
  },
  test: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, 'dev.sqlite3'),
      // filename: ':memory:',
    },
    migrations: {
      directory: path.join(__dirname, 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'seeds'),
    },
    useNullAsDefault: true,
  },
}

module.exports = cf
