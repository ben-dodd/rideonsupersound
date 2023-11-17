// import { Knex } from "knex"
// const { Knex } = require('knex')
// import path from 'path'
require('ts-node/register')
const path = require('path')
// Update with your config settings.

module.exports = {
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
    pool: {
      min: 2,
      max: 10,
    },
  },
  test: {
    client: 'sqlite3',
    connection: ':memory:',
    //   // filename: path.join(__dirname, 'dev.sqlite3'),
    //   filename: ':memory:',
    // },
    migrations: {
      directory: path.join(__dirname, 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'seeds'),
    },
    // debug: true,
    useNullAsDefault: true,
  },
}
