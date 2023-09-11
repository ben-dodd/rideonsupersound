interface StepperProps {
  steps: string[]
  value: number
  onChange?: Function
  disabled?: Boolean[]
  selectedBg?: string
  notSelectedBg?: string
  selectedText?: string
  notSelectedText?: string
  selectedTextHover?: string
  notSelectedTextHover?: string
}

export default function Stepper({ steps, value, onChange, disabled }: StepperProps) {
  return (
    <div className="flex py-2">
      <div className="flex justify-between pb-2">
        {steps?.map((val, index) => (
          <div
            key={index}
            className={`flex items-center px-2 group py-1${!disabled?.[index] && ' cursor-pointer'}`}
            onClick={() => (disabled?.[index] ? null : onChange(index))}
          >
            <div
              className={`stock-indicator__number ${
                disabled?.[index]
                  ? `bg-gray-200`
                  : value === index
                  ? 'bg-primary-light group-hover:bg-primary'
                  : 'bg-secondary-light group-hover:bg-secondary'
              }`}
            >
              {index + 1}
            </div>
            <div
              className={`pl-2 select-none ${
                disabled?.[index]
                  ? `text-gray-200`
                  : value === index
                  ? `text-primary group-hover:text-primary-dark`
                  : `text-secondary group-hover:text-secondary-dark`
              }`}
            >
              {val}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
