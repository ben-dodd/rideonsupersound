import { useState } from "react";
import Tabs from "@/components/_components/navigation/tabs";
import Discogs from "./discogs";
import Csv from "./csv";
import Form from "./form";
import Vendor from "./vendor";
import Items from "./items";

export default function SelectItems() {
  const [mode, setMode] = useState(0);

  return (
    <div className="w-full">
      <Tabs
        tabs={[
          "Add Existing Items",
          "Add New Items",
          "CSV Import",
          "Discogs Scanner",
        ]}
        value={mode}
        onChange={setMode}
      />
      <div className="flex w-full">
        <div className="w-3/5 mr-4">
          <div hidden={mode !== 0}>
            <Vendor />
          </div>
          <div hidden={mode !== 1}>
            <Form />
          </div>
          <div hidden={mode !== 2}>
            <Csv />
          </div>
          <div hidden={mode !== 3}>
            <Discogs />
          </div>
        </div>
        <div className="w-2/5">
          <Items />
        </div>
      </div>
    </div>
  );
}
