interface StepperProps {
  steps: string[];
  value: number;
  onChange?: Function;
  disabled?: Boolean;
  selectedBg?: string;
  notSelectedBg?: string;
  selectedText?: string;
  notSelectedText?: string;
  selectedTextHover?: string;
  notSelectedTextHover?: string;
}

export default function Stepper({
  steps,
  value,
  onChange,
  disabled,
  selectedBg,
  notSelectedBg,
  selectedText,
  notSelectedText,
  selectedTextHover,
  notSelectedTextHover,
}: StepperProps) {
  return (
    <div className="flex">
      <div className="flex justify-between pb-2">
        {steps?.map((val, index) => (
          <div
            key={index}
            className={`flex items-center px-2 py-1${
              !disabled && " cursor-pointer"
            }`}
            onClick={() => (disabled ? null : onChange(index))}
          >
            <div
              className={`stock-indicator__number ${
                value === index
                  ? selectedBg || "bg-primary-light"
                  : notSelectedBg || "bg-secondary-light"
              }`}
            >
              {index + 1}
            </div>
            <div
              className={`pl-2 ${
                value === index
                  ? `${selectedText || "text-primary"} hover:${
                      selectedTextHover || "text-primary-dark"
                    }`
                  : `${notSelectedText || "text-secondary"} hover:${
                      notSelectedTextHover || "text-secondary-dark"
                    }`
              }`}
            >
              {val}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
