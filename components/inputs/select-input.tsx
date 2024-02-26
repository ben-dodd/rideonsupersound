import { parseJSON } from 'lib/utils'
import { useState } from 'react'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'

interface SelectProps {
  object?: any
  onEdit?: Function
  dbField?: string
  inputLabel?: string
  isMulti?: boolean
  isDisabled?: boolean
  isInitLoading?: boolean
  isClearable?: boolean
  onCreateValue?: Function
  isCreateDisabled?: boolean
  sorted?: boolean
  customEdit?: Function
  delimiter?: string
  className?: string
  options?: any[]
}

export default function SelectInput({
  object,
  onEdit,
  dbField,
  inputLabel,
  isMulti,
  isDisabled,
  isInitLoading,
  isClearable,
  onCreateValue,
  isCreateDisabled,
  customEdit,
  delimiter,
  className,
  options,
}: SelectProps) {
  const [isLoading, setLoading] = useState(isInitLoading)

  return (
    <div className={className}>
      <div className="input-label">{inputLabel}</div>
      {isCreateDisabled ? (
        <Select
          style={{ menu: { zIndex: 5000, position: 'absolute' } }}
          classNamePrefix="react-select mt-0"
          isMulti={isMulti || false}
          isDisabled={isLoading || isDisabled || false}
          isLoading={isLoading || false}
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
                  : Array.isArray(parseJSON(object?.[dbField]))
                  ? parseJSON(object?.[dbField])?.map((val: string) => ({
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
          isDisabled={isLoading || isDisabled || false}
          isLoading={isLoading || false}
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
              onCreateValue(inputValue)
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