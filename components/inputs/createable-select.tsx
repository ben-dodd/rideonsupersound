// Packages
import { useState } from "react";

// Components
import CreatableSelect from "react-select/creatable";

interface TextFieldProps {
  id?: any;
  value?: number | string;
  label?: string;
  onChange?: any;
  inputLabel?: string;
  options?: any[];
  onCreateOption?: Function;
  displayOnly?: boolean;
  error?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  fieldRequired?: boolean;
  errorText?: string;
  className?: string;
  divClass?: string;
  labelClass?: string;
}

export default function CreateableSelect({
  id,
  value,
  label,
  onChange,
  inputLabel,
  options,
  onCreateOption,
  displayOnly = false,
  error = false,
  disabled = false,
  clearable = true,
  errorText,
  fieldRequired = false,
  className,
  divClass,
  labelClass,
}: TextFieldProps) {
  // State
  const [isLoading] = useState(false);
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
        className={`mb-1 flex transition-all items-center rounded-sm ${
          error || (fieldRequired && !value)
            ? "ring-2 ring-red-500 bg-red-100 hover:bg-red-200"
            : ""
        } ${divClass || ""} ${displayOnly && "bg-white hover:bg-white"}`}
        key={`${id || inputLabel || ""}--div`}
      >
        <CreatableSelect
          className="w-full"
          isClearable={clearable}
          isDisabled={isLoading || disabled}
          isLoading={isLoading}
          value={{
            value,
            label: isLoading ? "Loading..." : label,
          }}
          onChange={onChange}
          onCreateOption={(inputValue: string) => {
            // setLoading(true);
            onCreateOption(inputValue);
          }}
          options={options}
        />
      </div>
      {(error && errorText) ||
        (fieldRequired && !value && (
          <div className="px-1 text-xs text-red-500 mt-2 mb-2">
            {fieldRequired ? "Field is required" : errorText}
          </div>
        ))}
    </div>
  );
}
