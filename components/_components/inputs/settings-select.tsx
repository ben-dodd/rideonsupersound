// Packages
import { useState } from 'react'

// DB
import { useSelect } from '@/lib/swr-hooks'

// Functions
import { saveSelectToDatabase } from '@/lib/db-functions'

// Components
import CreatableSelect from 'react-select/creatable'
import Select from 'react-select'

// Types
interface SettingsSelectProps {
  object?: any
  onEdit?: Function
  dbField?: string
  inputLabel?: string
  error?: boolean
  isMulti?: boolean
  isDisabled?: boolean
  isClearable?: boolean
  isCreateDisabled?: boolean
  sorted?: boolean
  customEdit?: Function
  delimiter?: string
  className?: string
  subtitle?: boolean
}

const getSubtitle = (val, options) => {
  const opt = options?.find((opt) => opt?.label === val)
  return opt?.subtitle || ''
}

const CustomSingleValue = ({ data, selectProps }) => {
  // `selectProps` includes custom props passed to the <Select> component
  const customStyles = selectProps?.styles?.singleValue
    ? selectProps.styles.singleValue({}, { data, selectProps })
    : {}

  return (
    <div style={customStyles}>
      <div className="font-bold">{data.label}</div>
      <div className="text-xs text-gray-500">{data.subtitle}</div>
    </div>
  )
}

const CustomOption = (props) => {
  const { data, innerRef, innerProps, isFocused, isSelected, getStyles } = props

  const optionStyles = getStyles('option', props)

  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={{
        ...optionStyles,
        backgroundColor: isFocused
          ? '#2684ff40'
          : isSelected
          ? '#2684ff'
          : 'white',
        color: isSelected ? '#white' : '#black',
        cursor: 'pointer',
      }}
    >
      <div className="font-bold">{data.label}</div>
      <div className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'}`}>
        {data.subtitle}
      </div>
    </div>
  )
}

export default function SettingsSelect({
  object,
  onEdit,
  dbField,
  inputLabel,
  error,
  isMulti,
  isDisabled,
  isClearable,
  isCreateDisabled,
  subtitle = false,
  sorted = true,
  customEdit,
  delimiter,
  className,
}: SettingsSelectProps) {
  // SWR
  const { selects, isSelectsLoading, mutateSelects } = useSelect(dbField)
  // State
  const [isLoading, setLoading] = useState(false)
  const options = subtitle
    ? selects
        ?.sort((a, b) => a?.label?.localeCompare(b?.label))
        ?.map((opt) => ({
          value: opt?.label,
          label: opt?.label,
          subtitle: opt?.labelGroup || opt?.label_group || '',
        }))
    : sorted
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

  const colourStyles = {
    // menuList: (styles) => ({
    //   ...styles,
    //   background: 'papayawhip',
    // }),
    // option: (styles, { isFocused, isSelected }) => ({
    //   ...styles,
    //   background: isFocused
    //     ? 'hsla(291, 64%, 42%, 0.5)'
    //     : isSelected
    //     ? 'hsla(291, 64%, 42%, 1)'
    //     : undefined,
    //   zIndex: 1,
    // }),
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
    // option: (provided) => ({
    //   ...provided,
    //   display: 'flex',
    //   flexDirection: 'column',
    //   alignItems: 'flex-start',
    //   padding: '10px',
    // }),
    // singleValue: (provided) => ({
    //   ...provided,
    //   display: 'flex',
    //   flexDirection: 'column',
    // }),
    control: (styles) =>
      error
        ? {
            ...styles,
            background: '#EF444420',
            borderColor: '#EF4444',
            borderWidth: 2,
            '&:hover': {
              background: '#EF444440',
            },
          }
        : styles,
  }
  // styles={{
  //   menu: { zIndex: 5000, position: 'absolute' },
  //   valueContainer: { backgroundColor: 'red' },
  // }}

  return (
    <div className={className}>
      <div className="input-label">{inputLabel}</div>
      {isCreateDisabled ? (
        <Select
          styles={colourStyles}
          classNamePrefix="react-select mt-0"
          error={error}
          isMulti={isMulti || false}
          isDisabled={isLoading || isSelectsLoading || isDisabled || false}
          isLoading={isLoading || isSelectsLoading || false}
          isClearable={isClearable || true}
          options={options}
          subtitle={subtitle}
          components={
            subtitle
              ? {
                  SingleValue: CustomSingleValue,
                  Option: CustomOption,
                }
              : null
          }
          value={
            dbField
              ? isMulti
                ? Array.isArray(object?.[dbField])
                  ? object?.[dbField]?.map((val: string) => ({
                      value: val,
                      label: val,
                      subtitle: subtitle ? getSubtitle(val, options) : '',
                    }))
                  : object?.[dbField]
                  ? [
                      {
                        value: object?.[dbField] || '',
                        label: object?.[dbField] || '',
                        subtitle: subtitle
                          ? getSubtitle(object?.[dbField], options)
                          : '',
                      },
                    ]
                  : []
                : {
                    value: object?.[dbField] || '',
                    label: object?.[dbField] || '',
                    subtitle: subtitle
                      ? getSubtitle(object?.[dbField], options)
                      : '',
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
          styles={colourStyles}
          classNamePrefix="react-select mt-0"
          error={error}
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
              saveSelectToDatabase(inputValue, dbField, mutateSelects)
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
