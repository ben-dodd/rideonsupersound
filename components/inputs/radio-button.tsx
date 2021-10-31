// Types
interface RadioButtonProps {
  value: string;
  onChange: Function;
  inputLabel: string;
  options: OptionProps[];
  group: string;
  displayOnly?: boolean;
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
  displayOnly,
}: RadioButtonProps) {
  return (
    <div>
      {inputLabel && <label className={`input-label`}>{inputLabel}</label>}
      <div className={"radio-button__container mb-2"}>
        {options.map((e) => (
          <label key={e.id} id={e.id} className="radio-button__label">
            <input
              className="radio-button__input"
              id={e?.id}
              name={group || null}
              type="radio"
              checked={value === e.value}
              onChange={() => onChange(e.value)}
            />
            {e.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export default RadioButton;
