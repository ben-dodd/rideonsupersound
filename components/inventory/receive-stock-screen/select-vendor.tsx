// DB
import { useVendors } from "@/lib/swr-hooks";
import { VendorObject } from "@/lib/types";

// Functions

// Components
import CreateableSelect from "@/components/_components/inputs/createable-select";

// Icons
import { useAtom } from "jotai";
import { receiveStockAtom } from "@/lib/atoms";

export default function SelectVendor() {
  const [basket, setBasket] = useAtom(receiveStockAtom);
  const { vendors } = useVendors();

  return (
    <div>
      <div className="font-bold text-xl mt-4">Select Vendor</div>
      <CreateableSelect
        inputLabel="Select vendor"
        fieldRequired
        value={basket?.vendor_id}
        label={
          vendors?.filter((v: VendorObject) => v?.id === basket?.vendor_id)[0]
            ?.name || ""
        }
        onChange={(vendorObject: any) => {
          setBasket({
            ...basket,
            vendor_id: parseInt(vendorObject?.value),
          });
        }}
        onCreateOption={(inputValue: string) =>
          // setCreateCustomerSidebar({
          //   id: 1,
          //   name: inputValue,
          // })
          null
        }
        options={vendors?.map((val: VendorObject) => ({
          value: val?.id,
          label: val?.name || "",
        }))}
      />
    </div>
  );
}
