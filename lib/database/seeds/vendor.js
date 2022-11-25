var fs = require('fs')

exports.seed = (knex, Promise) => {
  const sql = fs.readFileSync('./ross.sql').toString()
  return knex
    .raw('DROP DATABASE ross')
    .then(() => knex.raw('CREATE DATABASE ross'))
    .then(() => knex.raw(sql))
}
