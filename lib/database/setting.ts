import connection from './conn'

export function dbGetSetting(dbField, db = connection) {
  return db('select_option')
    .select('label')
    .where(`setting_select`, dbField)
    .then((options) => options.map((option) => option?.label))
}
