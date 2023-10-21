import * as fs from 'fs'
// const fs = require('fs')

let filename: string = 'schema.sql'
let input = fs.readFileSync(filename).toString()
let lines: string[]

if (input.includes('\r\n')) {
  lines = input.split('\r\n')
} else {
  lines = input.split('\n')
}

let tables: any = []
let tableCount = 0

lines.forEach(function (line) {
  if (line.startsWith('CREATE TABLE')) {
    let tableName = line.substring(14, line.length - 3)
    console.log(tableName)
    tables.push({
      tableName,
      columns: [],
    })
  }

  if (line.startsWith('  ')) {
    if (line.endsWith(',')) {
      line = line.slice(2, -1)
    } else {
      line = line.slice(2)
    }

    tables[tableCount].columns.push(line)
  }

  if (line.startsWith(') ENGINE')) {
    tableCount += 1
  }
})

let count = 0
tables.forEach((table: any) => {
  count += 1
  console.log('// -----------')
  let sqlString = 'exports.up = function(knex, Promise) {\n'
  sqlString += `\treturn knex.schema.createTable('${table.tableName}', function (table) {`

  // console.log(sqlString);
  let written = sqlString + '\n'

  let columnName = ''
  let isPrimary = ''

  table.columns.forEach((column: string) => {
    sqlString = '\t\ttable'
    let tokens: string[] = column.split(' ')

    if (column.startsWith('`')) {
      columnName = tokens[0].slice(1, -1)
    }
    let columnType = tokens[1]
    let size = ''

    let autoIncrement = false

    if (column.endsWith('AUTO_INCREMENT')) {
      sqlString += `.increments('${columnName}')`
      autoIncrement = true
      isPrimary = columnName
    }

    if (columnType && columnType.startsWith('int') && autoIncrement === false) {
      size = columnType.slice(4, -1)
      sqlString += `.integer('${columnName}', ${size})`
    }

    if (columnType && columnType.startsWith('smallint') && autoIncrement === false) {
      size = columnType.slice(9, -1)
      sqlString += `.integer('${columnName}', ${size})`
    }

    if (columnType && columnType.startsWith('tinyint') && autoIncrement === false) {
      size = columnType.slice(8, -1)
      sqlString += `.integer('${columnName}', ${size})`
    }

    if (columnType.startsWith('varchar')) {
      size = columnType.slice(8, -1)
      sqlString += `.string('${columnName}', ${size})`

      if (column.includes('CHARACTER SET')) {
        let charToken = tokens.indexOf('CHARACTER')
        if (charToken !== -1 && tokens[charToken + 1] === 'SET') {
          if (tokens[charToken + 2] === 'ascii') {
            sqlString += `.collate('ascii_general_ci')`
          }
        }
      }
    }

    if (columnType.startsWith('char')) {
      size = columnType.slice(5, -1)
      sqlString += `.string('${columnName}', ${size})`
    }

    if (columnType.startsWith('text')) {
      sqlString += `.text('${columnName}')`
    }

    if (columnType.startsWith('enum')) {
      let enumType = columnType.slice(5, -1)
      sqlString += `.enum('${columnName}', [${enumType}])`
    }

    if (columnType.startsWith('datetime')) {
      sqlString += `.datetime('${columnName}')`
    } else if (columnType.startsWith('date')) {
      sqlString += `.date('${columnName}')`
    }

    if (columnType.startsWith('time')) {
      sqlString += `.time('${columnName}')`
    }

    if (tokens[2] === 'unsigned') {
      sqlString += `.unsigned()`
    }

    if (column.includes('NOT NULL')) {
      sqlString += `.notNullable()`
    }

    let defaultIndex = tokens.indexOf('DEFAULT')
    if (defaultIndex !== -1) {
      const value = tokens[defaultIndex + 1]
      let defaultValue = ''

      if (value === 'CURRENT_TIMESTAMP' || value === 'CURRENT_TIMESTAMP,') {
        defaultValue = `knex.fn.now(6)`
        sqlString += `.defaultTo(${defaultValue})`
      } else if (value === 'NULL' || value === 'NULL,') {
        sqlString += `.nullable()`
      } else {
        sqlString += `.defaultTo(${value})`
      }
    }

    if (column.startsWith('PRIMARY KEY')) {
      const primaryName = column.slice(14, -2)
      if (isPrimary !== primaryName) {
        sqlString += `.primary('${primaryName}')`
      }
    }

    if (column.startsWith('UNIQUE')) {
      let indexName = tokens[2]
      if (!indexName.startsWith('`')) {
        throw new Error('Check index name')
      }

      indexName = indexName.slice(1, -1)
      let tmp = column.split('(')

      const uniqueColumns = tmp[1].slice(0, -1)

      sqlString += `.unique([${uniqueColumns}], '${indexName}')`
    }

    if (column.startsWith('KEY')) {
      let keyName = tokens[1]

      if (!keyName.startsWith('`')) {
        throw new Error('Check key name')
      }
      keyName = keyName.slice(1, -1)

      let tmp = column.split('(')
      // console.log(tmp[1])
      let keys = ''
      if (tmp[1].endsWith('`')) {
        keys = tmp[1]
      } else {
        keys = tmp[1].slice(0, -1)
      }

      sqlString += `.index([${keys}], '${keyName}')`
    }

    if (column.startsWith('CONSTRAINT')) {
      let foreignKey = ''
      let foreignKeyName = ''
      let referenceTable = ''
      let referenceColumn = ''

      if (tokens[2] === 'FOREIGN') {
        foreignKey = tokens[4].slice(2, -2)
        foreignKeyName = tokens[1].slice(1, -1)
      } else {
        throw new Error('Error processing CONSTRAINT, please tell the author')
      }

      if (tokens[5] === 'REFERENCES') {
        referenceTable = tokens[6].slice(1, -1)
        referenceColumn = tokens[7].slice(2, -2)
      } else {
        throw new Error('Error processing CONSTRAINT, please tell the author')
      }

      let conditions = column.split(' ON ')
      let onDelete = ''
      let onUpdate = ''

      if (conditions[1].startsWith('DELETE')) {
        onDelete = conditions[1].slice(7)
      } else {
        throw new Error('Error processing CONSTRAINT, please tell the author')
      }

      if (conditions[2].startsWith('UPDATE')) {
        onUpdate = conditions[2].slice(7)
      } else {
        throw new Error('Error processing CONSTRAINT, please tell the author')
      }

      sqlString += `.foreign('${foreignKey}', '${foreignKeyName}').references('${referenceTable}.${referenceColumn}').onDelete('${onDelete}').onUpdate('${onUpdate}')`
    }

    sqlString += `;`
    // console.log(sqlString);
    written += sqlString + '\n'
  })

  sqlString = `\t});\n};`
  written += sqlString + '\n'

  sqlString = `\nexports.down = function (knex) {` + `\n\treturn knex.schema.dropTable('${table.tableName}');` + `\n};`
  written += sqlString + '\n'

  fs.writeFileSync(
    `migrations/202211282148${count.toString().padStart(2, '0')}_create_table_${table.tableName}.js`,
    written,
  )
})
