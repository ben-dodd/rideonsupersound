import { createSetting, useSetting } from 'lib/api/settings'
import SelectInput from './select-input'

interface SettingsSelectProps {
  object?: any
  onEdit?: Function
  dbField?: string
  inputLabel?: string
  isMulti?: boolean
  isDisabled?: boolean
  isClearable?: boolean
  isCreateDisabled?: boolean
  sorted?: boolean
  customEdit?: Function
  delimiter?: string
  className?: string
}

export default function SettingsSelect({
  object,
  onEdit,
  dbField,
  inputLabel,
  isMulti,
  isDisabled,
  isClearable,
  isCreateDisabled,
  sorted = true,
  customEdit,
  delimiter,
  className,
}: SettingsSelectProps) {
  const { selects, isSelectsLoading } = useSetting(dbField)
  const options = sorted
    ? selects?.sort()?.map((opt: string) => ({
        value: opt,
        label: opt,
      }))
    : selects?.map((opt: string) => ({
        value: opt,
        label: opt,
      }))

  return (
    <SelectInput
      options={options}
      isInitLoading={isSelectsLoading}
      className={className}
      isCreateDisabled={isCreateDisabled}
      isMulti={isMulti}
      isDisabled={isDisabled}
      isClearable={isClearable}
      delimiter={delimiter}
      dbField={dbField}
      object={object}
      customEdit={customEdit}
      onEdit={onEdit}
      sorted={sorted}
      inputLabel={inputLabel}
      onCreateValue={(inputValue) => createSetting({ label: inputValue, settingSelect: dbField })}
    />
  )
}
