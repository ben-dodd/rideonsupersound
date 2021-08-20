interface TextFieldProps {
  id?: any;
  value?: string;
  valueNum?: number;
  onChange?: any;
  inputLabel?: string;
  inputType?: string;
  rows?: number;
  startAdornment?: any;
  endAdornment?: any;
  multiline?: boolean;
  displayOnly?: boolean;
  autoFocus?: boolean;
  selectOnFocus?: boolean;
  error?: boolean;
  max?: number;
  min?: number;
  className?: string;
  divClass?: string;
  labelClass?: string;
  startAdornmentClass?: string;
  endAdornmentClass?: string;
  inputClass?: string;
}

export default function TextField({
  id,
  value,
  valueNum,
  onChange,
  inputLabel,
  inputType,
  rows,
  startAdornment,
  endAdornment,
  multiline = false,
  displayOnly = false,
  autoFocus = false,
  selectOnFocus = false,
  error = false,
  max,
  min = 0,
  className,
  divClass,
  labelClass,
  startAdornmentClass,
  endAdornmentClass,
  inputClass,
}: TextFieldProps) {
  let isError = error || (valueNum && (valueNum > max || valueNum < min));

  return (
    <div
      className={className || ""}
      key={`${id || inputLabel || ""}--div-main`}
    >
      {inputLabel && (
        <div
          className={`transition-all px-1 text-xs mt-2 mb-2 ${
            labelClass || ""
          }`}
        >
          {inputLabel}
        </div>
      )}
      <div
        className={`mb-1 flex transition-all items-center rounded-md ${
          isError
            ? "ring-4 ring-red-500 bg-red-100 hover:bg-red-200"
            : "ring-1 ring-black bg-gray-100 hover:bg-gray-200"
        } ${divClass || ""} ${displayOnly && "bg-white hover:bg-white"}`}
        key={`${id || inputLabel || ""}--div`}
      >
        {startAdornment && (
          <div className={`mx-1 ${startAdornmentClass || ""}`}>
            {startAdornment}
          </div>
        )}
        {displayOnly ? (
          <div className="w-full py-1 px-2 outline-none bg-transparent">
            {value ?? ""}
          </div>
        ) : multiline ? (
          <textarea
            id={id || inputLabel || null}
            name={id || inputLabel || null}
            className="appearance-none w-full py-1 px-2 outline-none bg-transparent"
            onChange={onChange}
            rows={rows || 3}
            value={value}
          />
        ) : (
          <input
            id={id || inputLabel || null}
            name={id || inputLabel || null}
            type={inputType || "text"}
            className={`appearance-none w-full py-1 px-2 outline-none bg-transparent ${
              inputClass || ""
            }`}
            value={inputType === "number" ? valueNum : value}
            onChange={onChange}
            autoFocus={autoFocus || false}
            onFocus={selectOnFocus ? (e) => e.target.select() : null}
            max={max ?? null}
            min={min ?? null}
          />
        )}
        {endAdornment && (
          <div className={`mx-1 ${endAdornmentClass || ""}`}>
            {endAdornment}
          </div>
        )}
      </div>
    </div>
  );
}
