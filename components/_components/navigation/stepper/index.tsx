interface StepperProps {
  steps: string[];
  value: number;
  onChange: Function;
}

export default function Stepper({ steps, value, onChange }: StepperProps) {
  return (
    <div className="flex">
      <div className="flex justify-between pb-2">
        {steps?.map((val, index) => (
          <div
            className="flex items-center cursor-pointer px-2 py-1"
            onClick={() => onChange(index)}
          >
            <div
              className={`stock-indicator__number ${
                value === index ? "bg-primary-light" : "bg-secondary-light"
              }`}
            >
              {index + 1}
            </div>
            <div
              className={`pl-2 ${
                value === index
                  ? "text-primary hover:text-primary-dark"
                  : "text-secondary hover:text-secondary-dark"
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
