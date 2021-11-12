// Packages
import { useState } from "react";

// DB
import { useSelect } from "@/lib/swr-hooks";

// Functions
import { saveSelectToDatabase } from "@/lib/db-functions";

// Components
import CreatableSelect from "react-select/creatable";

// Types
interface SettingsSelectProps {
  object?: any;
  onEdit?: Function;
  dbField?: string;
  inputLabel?: string;
  isMulti?: boolean;
  isDisabled?: boolean;
  isClearable?: boolean;
  isCreateDisabled?: boolean;
  customEdit?: Function;
  delimiter?: string;
  className?: string;
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
  customEdit,
  delimiter,
  className,
}: SettingsSelectProps) {
  // SWR
  const { selects, isSelectsLoading, mutateSelects } = useSelect(dbField);

  // State
  const [isLoading, setLoading] = useState(false);
  return (
    <div className={className}>
      <div className="input-label">{inputLabel}</div>
      <CreatableSelect
        style={{ menu: { zIndex: 5000, position: "absolute" } }}
        classNamePrefix="react-select mt-0"
        isMulti={isMulti || false}
        isDisabled={isLoading || isSelectsLoading || isDisabled || false}
        isLoading={isLoading || isSelectsLoading || false}
        isClearable={isClearable || true}
        delimiter={delimiter || null}
        value={
          dbField
            ? isMulti
              ? object &&
                object[dbField]?.map((val: string) => ({
                  value: val,
                  label: val,
                }))
              : {
                  value: (object && object[dbField]) || "",
                  label: (object && object[dbField]) || "",
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
            : onEdit({ ...object, [dbField]: e?.value || null });
        }}
        onCreateOption={(inputValue: string) => {
          if (!isCreateDisabled) {
            setLoading(true);
            saveSelectToDatabase(inputValue, dbField, mutateSelects);
            setLoading(false);
          }
        }}
        options={selects?.map((select: any) => ({
          value: select?.label,
          label: select?.label,
        }))}
      />
    </div>
  );
}
