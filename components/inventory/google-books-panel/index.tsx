// Packages
import { useState, useEffect } from "react";

// Functions
import { getGoogleBooksOptionsByItem } from "@/lib/data-functions";

// Components
import Image from "next/image";

// Icons
import SyncIcon from "@mui/icons-material/Sync";
import { StockObject } from "@/lib/types";
import GoogleBooksItem from "./google-books-item";
import GoogleBooksOption from "./google-books-option";
import { saveSystemLog } from "@/lib/db-functions";
import { useAtom } from "jotai";
import { clerkAtom } from "@/lib/atoms";

interface inventoryProps {
  item: StockObject;
  setItem: Function;
  disabled?: boolean;
}

export default function GoogleBooksPanel({
  item,
  setItem,
  disabled,
}: inventoryProps) {
  // State
  const [googleBooksOptions, setGoogleBooksOptions] = useState(null);

  // Constants
  const googleBooksItem = item?.googleBooksItem;
  const [clerk] = useAtom(clerkAtom);

  // Load
  useEffect(() => {
    if (
      item?.media === "Literature" &&
      !Boolean(item?.googleBooksItem) &&
      (Boolean(item?.artist) || Boolean(item?.title))
    )
      handleGetGoogleBooksOptions();
  }, [item]);

  const handleGetGoogleBooksOptions = async () => {
    const options = await getGoogleBooksOptionsByItem(item);
    setGoogleBooksOptions(options);
  };

  const handleGoogleBooksOptionClick = (googleBooksItem) => {
    saveSystemLog(`Googlebooks Option clicked.`, clerk?.id);
    setItem({
      ...item,
      image_url: googleBooksItem?.volumeInfo?.imageLinks?.thumbnail || null,
      googleBooksItem,
    });
  };

  return (
    <div className="flex flex-col h-inventory">
      <div className="flex justify-between px-2">
        <img
          src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/google-books-logo.png`}
          alt="GoogleBooks Logo"
          width="100px"
          height="50px"
        />
        <button
          className="icon-text-button hover:bg-blue-100"
          disabled={disabled}
          onClick={() => {
            saveSystemLog("Googlebooks Sync clicked.", clerk?.id);
            setItem({ ...item, googleBooksItem: null });
            handleGetGoogleBooksOptions();
          }}
        >
          <SyncIcon /> Refresh GoogleBooks Search
        </button>
      </div>
      <div className="flex-1 overflow-y-auto pt-4 mx-4">
        {googleBooksItem ? (
          <GoogleBooksItem googleBooksItem={googleBooksItem} />
        ) : googleBooksOptions ? (
          <div>
            {googleBooksOptions.map((opt: any, i: number) => (
              <GoogleBooksOption
                key={i}
                opt={opt}
                handleGoogleBooksOptionClick={handleGoogleBooksOptionClick}
              />
            ))}
          </div>
        ) : (
          <div />
        )}
      </div>
      <div />
    </div>
  );
}
