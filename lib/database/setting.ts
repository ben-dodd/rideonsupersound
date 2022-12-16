import connection from './conn'
import { js2mysql } from './utils/helpers'

export function dbGetSetting(dbField, db = connection) {
  return db('select_option')
    .select('label')
    .where(`setting_select`, dbField)
    .then((options) => options.map((option) => option?.label))
}

export function dbCreateSetting(setting, db = connection) {
  return db('select_option').insert(js2mysql(setting))
}
