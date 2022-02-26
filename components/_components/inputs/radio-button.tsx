// Types
interface RadioButtonProps {
  value: string;
  onChange: Function;
  inputLabel: string;
  options: OptionProps[];
  group: string;
  disabled?: boolean;
}

interface OptionProps {
  id: string;
  value: string;
  label: string;
}

// BUG fix radio buttons

function RadioButton({
  value,
  onChange,
  inputLabel,
  options,
  group,
  disabled,
}: RadioButtonProps) {
  console.log(group);
  console.log(options);
  return (
    <div>
      {inputLabel && <label className={`input-label pb-2`}>{inputLabel}</label>}
      <div className={"radio-button__container mb-2"}>
        {options.map((e) => (
          <label key={e.id} id={e.id} className="radio-button__label">
            <input
              className="radio-button__input"
              id={e.id}
              name={group || null}
              type="radio"
              checked={value === e.value}
              onChange={() => onChange(e.value)}
              disabled={disabled}
            />
            {e.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export default RadioButton;
