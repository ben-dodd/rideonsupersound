import { createSettingSelectInDatabase } from 'lib/database/create'
import { useSelect } from 'lib/database/read'
import { useState } from 'react'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'

// Types
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
  // SWR
  const { selects, isSelectsLoading, mutateSelects } = useSelect(dbField)
  // State
  const [isLoading, setLoading] = useState(false)
  const options = sorted
    ? selects
        ?.map((s) => s?.label)
        ?.sort()
        ?.map((opt: string) => ({
          value: opt,
          label: opt,
        }))
    : selects
        ?.map((s) => s?.label)
        ?.map((opt: string) => ({
          value: opt,
          label: opt,
        }))

  return (
    <div className={className}>
      <div className="input-label">{inputLabel}</div>
      {isCreateDisabled ? (
        <Select
          style={{ menu: { zIndex: 5000, position: 'absolute' } }}
          classNamePrefix="react-select mt-0"
          isMulti={isMulti || false}
          isDisabled={isLoading || isSelectsLoading || isDisabled || false}
          isLoading={isLoading || isSelectsLoading || false}
          isClearable={isClearable || true}
          options={options}
          value={
            dbField
              ? isMulti
                ? Array.isArray(object?.[dbField])
                  ? object?.[dbField]?.map((val: string) => ({
                      value: val,
                      label: val,
                    }))
                  : object?.[dbField]
                  ? [
                      {
                        value: object?.[dbField] || '',
                        label: object?.[dbField] || '',
                      },
                    ]
                  : []
                : {
                    value: object?.[dbField] || '',
                    label: object?.[dbField] || '',
                  }
              : null
          }
          onChange={(e: any) => {
            customEdit
              ? customEdit(e)
              : isMulti
              ? onEdit({
                  ...object,
                  [dbField]: e ? e.map((obj: any) => obj.value) : [],
                })
              : onEdit({ ...object, [dbField]: e?.value || null })
          }}
        />
      ) : (
        <CreatableSelect
          style={{ menu: { zIndex: 5000, position: 'absolute' } }}
          classNamePrefix="react-select mt-0"
          isMulti={isMulti || false}
          isDisabled={isLoading || isSelectsLoading || isDisabled || false}
          isLoading={isLoading || isSelectsLoading || false}
          isClearable={isClearable || true}
          delimiter={delimiter || null}
          value={
            dbField
              ? isMulti
                ? Array.isArray(object?.[dbField])
                  ? object?.[dbField]?.map((val: string) => ({
                      value: val,
                      label: val,
                    }))
                  : object?.[dbField]
                  ? [
                      {
                        value: object?.[dbField] || '',
                        label: object?.[dbField] || '',
                      },
                    ]
                  : []
                : {
                    value: object?.[dbField] || '',
                    label: object?.[dbField] || '',
                  }
              : null
          }
          onChange={(e: any) => {
            customEdit
              ? customEdit(e)
              : isMulti
              ? onEdit({
                  ...object,
                  [dbField]: e ? e.map((obj: any) => obj.value) : [],
                })
              : onEdit({ ...object, [dbField]: e?.value || null })
          }}
          onCreateOption={(inputValue: string) => {
            if (!isCreateDisabled) {
              setLoading(true)
              createSettingSelectInDatabase(inputValue, dbField, mutateSelects)
              if (isMulti)
                onEdit({
                  ...object,
                  [dbField]: inputValue
                    ? object?.[dbField]
                      ? Array.isArray(object[dbField])
                        ? [...object[dbField], inputValue]
                        : [object[dbField], inputValue]
                      : [inputValue]
                    : [],
                })
              else onEdit({ ...object, [dbField]: inputValue || null })
              setLoading(false)
            }
          }}
          options={options}
        />
      )}
    </div>
  )
}
