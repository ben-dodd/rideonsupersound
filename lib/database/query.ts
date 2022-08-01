/*
 *
 * Create Queries
 *
 */

export function getCreateQuery(table: string, properties: any) {
  const createQuery: string = `INSERT INTO ${table} (${Object.keys(
    properties
  ).join(', ')}) VALUES (${Object.keys(properties)
    .map(() => '?')
    .join(', ')})`
  const values: (string | number)[] = Object.values(properties).map(
    (val: any) => mysqlSafeValue(val)
  )
  return {
    createQuery,
    values,
  }
}

/*
 *
 * Delete Queries
 *
 */

export function getDeleteQuery(
  table: string,
  id: number,
  id_key?: string,
  isHardDelete?: boolean
) {
  const deleteQuery: string = isHardDelete
    ? `DELETE FROM ${table} WHERE ${id_key ?? 'id'} = ?`
    : `UPDATE ${table} SET is_deleted = 1 WHERE ${id_key ?? 'id'} = ?`
  const values: (string | number)[] = [id]
  return { deleteQuery, values }
}

/*
 *
 * Update Queries
 *
 */

export function getUpdateQuery(table: string, properties: any, id: number) {
  const updateQuery: string = `UPDATE ${table} SET ${Object.keys(properties)
    .map((key) => `${key} = ?`)
    .join(', ')} WHERE id = ?`
  const values: (string | number)[] = [
    ...Object.values(properties).map((val: any) => mysqlSafeValue(val)),
    id,
  ]
  return { updateQuery, values }
}

/*
 *
 * Read Queries
 *
 */

interface readQueryProps {
  columns?: string | string[]
  table: string
  joins?: any[]
  where?: string | any[]
  isDesc?: boolean
  orderBy?: string
  limit?: number
}

export function getReadQuery({
  columns,
  table,
  joins,
  where,
  isDesc,
  orderBy,
  limit,
}: readQueryProps) {
  const joinQuery = joins ? createJoinsQuery(joins, table) : null
  const joinColumnQuery = joins ? createJoinColumnQuery(joins) : ''
  const columnQuery = columns
    ? `${
        Array.isArray(columns)
          ? columns?.map((column) => `${table}.${column}`).join(',\n')
          : columns
      }`
    : '*'
  const readQuery: string = `
  SELECT\n${columnQuery}${joinColumnQuery} FROM ${table}${
    joinQuery ? ` ${joinQuery}` : ''
  }${where ? ` WHERE ${where}` : ''}${
    orderBy ? ` ORDER BY ${orderBy}${isDesc ? ` desc` : ''}` : ''
  }
  ${limit ? ` LIMIT ${limit}` : ''}
  `
  // console.log(readQuery)
  return readQuery
}

function createSelectQuery(columns, table, where) {
  return `SELECT ${
    columns
      ? columns
          .map((column) =>
            typeof columns === 'object'
              ? `${column.value}${column.as ? ` AS ${column.as}` : ''}`
              : column
          )
          .join(', ')
      : '*'
  } FROM ${table}${where ? ` WHERE ${where}` : ''}`
}

export function createJoinsQuery(joins, table) {
  return joins
    .map(
      (join) =>
        `\nLEFT JOIN (${
          join.columns
            ? `SELECT ${join.columns
                ?.map((column) =>
                  typeof column === 'object'
                    ? `${column.key}${column.as ? ` AS ${column.as}` : ''}`
                    : column
                )
                ?.join(', ')} FROM `
            : ''
        }${join.table}${join.where ? ` WHERE ${join.where?.join(' ')}` : ''}${
          join.groupBy ? ` GROUP BY ${join.groupBy}` : ''
        })${join.as ? ` AS ${join.as}` : ''}${
          join.on
            ? ` ON ${join.as ?? join.table}.${join.on[0]} ${
                join.on[1]
              } ${table}.${join.on[2]}`
            : ''
        }`
    )
    .join(' ')
}

export function createJoinColumnQuery(joins) {
  return joins
    ? `, ${
        Array.isArray(joins)
          ? joins
              ?.map?.((join) =>
                join.columns
                  ?.filter((column) => !column?.columnSkip)
                  ?.map(
                    (column) =>
                      `${join.as || join.table}.${
                        typeof column === 'object'
                          ? column.as || column.key
                          : column
                      }`
                  )
                  ?.join(',\n')
              )
              ?.join(',\n')
          : joins
      }`
    : ''
}

/*
 *
 * Helper Functions
 *
 */

export function mysqlSafeValue(val: any) {
  if (val === undefined) return null
  else if (Array.isArray(val) || typeof val === 'object')
    return JSON.stringify(val)
  else if (typeof val === 'boolean') return val ? 1 : 0
  else return val
}

export function reverseMysqlSafeValue(val: string | number) {
  console.log(val)
  if (typeof val === 'number') return val
  try {
    let object = JSON.parse(val)
    console.log(object)
    if (object && typeof object === 'object') return object
  } catch (e) {
    console.log(e)
  }
  return val
}
