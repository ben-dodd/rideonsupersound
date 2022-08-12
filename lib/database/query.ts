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
  table: string | string[]
  joins?: any[]
  where?: string | any[]
  isDesc?: boolean
  orderBy?: string | string[]
  limit?: string | string[]
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
  const columnQuery = columns ? createColumnQuery(columns, table) : '*'
  const joinQuery = createJoinsQuery(joins, table)
  const joinColumnQuery = createJoinColumnQuery(joins)
  const whereQuery = createWhereQuery(where)
  const orderQuery = createOrderQuery(orderBy, isDesc)
  const limitQuery = createLimitQuery(limit)
  const selectQuery = createSelectQuery(
    columnQuery,
    joinColumnQuery,
    table,
    joinQuery,
    whereQuery,
    orderQuery,
    limitQuery
  )
  const readQuery: string = selectQuery
  // console.log(readQuery)
  return readQuery
}

export function createColumnQuery(columns, table) {
  return `${
    Array.isArray(columns)
      ? columns
          ?.filter((column) => !column?.columnSkip)
          ?.map(
            (column) =>
              `${table}.${
                typeof column === 'object'
                  ? column?.key?.includes?.('(')
                    ? `${column.as}`
                    : `${column.key}${column.as ? ` AS ${column.as}` : ''}`
                  : column
              }`
          )
          .join(',\n')
      : columns
  }`
}

export function createJoinsQuery(joins, table) {
  return joins
    ? joins
        .map((join) => {
          const selectQuery =
            join?.columns?.filter(
              (column) =>
                column?.key?.includes?.('(') || column?.includes?.('(')
            ).length > 0
          return selectQuery
            ? `\nLEFT JOIN (${
                join.columns
                  ? `SELECT ${join.columns
                      ?.map((column) =>
                        typeof column === 'object'
                          ? `${column.key}${
                              column.as ? ` AS ${column.as}` : ''
                            }`
                          : column
                      )
                      ?.join(', ')} FROM `
                  : ''
              }${join.table}${createWhereQuery(join.where)}${
                join.groupBy ? ` GROUP BY ${join.groupBy}` : ''
              })${join.as ? ` AS ${join.as}` : ''}${
                join.on ? ` ON ${join.on}` : ''
              }`
            : `\nLEFT JOIN ${join.table}${createWhereQuery(join.where)}${
                join.groupBy ? ` GROUP BY ${join.groupBy}` : ''
              }${join.as ? ` AS ${join.as}` : ''}${
                join.on ? ` ON ${join.on}` : ''
              }`
        })
        .join(' ')
    : ''
}

export function createJoinColumnQuery(joins) {
  return Array.isArray(joins)
    ? `, ${joins
        ?.map?.((join) =>
          createColumnQuery(join?.columns, join?.as || join?.table)
        )
        ?.join(',\n')}`
    : ''
}

export function createWhereQuery(where) {
  return where
    ? ` WHERE ${Array.isArray(where) ? where?.join(' AND ') : where}`
    : ''
}

export function createOrderQuery(orderBy, isDesc) {
  return orderBy ? ` ORDER BY ${orderBy}${isDesc ? ` DESC` : ''}` : ''
}

export function createLimitQuery(limit) {
  return `${limit && !isNaN(limit) ? ` LIMIT ${limit}` : ''}`
}

export function createSelectQuery(
  columnQuery,
  joinColumnQuery,
  table,
  joinQuery,
  whereQuery,
  orderQuery,
  limitQuery
) {
  return `
  SELECT\n${columnQuery}${joinColumnQuery} FROM ${table}${joinQuery}
  ${whereQuery}${orderQuery}${limitQuery}
  `
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

export function reverseMysqlSafeValue(val: any) {
  if (typeof val === 'number') return val
  try {
    let object = JSON.parse(val)
    if (object && typeof object === 'object') return object
  } catch (e) {
    return val
  }
}
