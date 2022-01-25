// Packages
import { useState, useEffect } from "react";

// Functions
import { andList, getGoogleBooksOptionsByItem } from "@/lib/data-functions";

// Components
import Image from "next/image";

// Icons
import SyncIcon from "@mui/icons-material/Sync";
import dayjs from "dayjs";

export default function GoogleBooksPanel({ item, setItem }) {
  // State
  const [googleBooksOptions, setGoogleBooksOptions] = useState(null);

  // Constants
  const googleBooksItem = item?.googleBooksItem;

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
    setItem({
      ...item,
      image_url: googleBooksItem?.volumeInfo?.imageLinks?.thumbnail || null,
      googleBooksItem,
    });
  };

  return (
    <div className="flex flex-col h-inventory">
      <div className="flex justify-between px-2">
        <Image
          src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/google-books-logo.png`}
          alt="GoogleBooks Logo"
          width="100px"
          height="50px"
        />
        <button
          className="icon-text-button hover:bg-blue-100"
          onClick={() => {
            setItem({ ...item, googleBooksItem: null });
            handleGetGoogleBooksOptions();
          }}
        >
          <SyncIcon /> Refresh GoogleBooks Search
        </button>
      </div>
      <div className="flex-1 overflow-y-auto pt-4 mx-4">
        {googleBooksItem ? (
          <div>
            <div className="w-32">
              <div className="w-32 h-32 relative">
                <Image
                  layout="fill"
                  objectFit="contain"
                  src={
                    googleBooksItem?.volumeInfo?.imageLinks?.thumbnail ||
                    `${process.env.NEXT_PUBLIC_RESOURCE_URL}img/default.png`
                  }
                  alt={googleBooksItem?.volumeInfo?.title || "Book cover art"}
                />
                {/*<div className="absolute w-32 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center">
                {getItemSku(item)}
              </div>*/}
              </div>
            </div>
            <div className="font-bold">
              {googleBooksItem?.volumeInfo?.title}
            </div>
            <div>{googleBooksItem?.volumeInfo?.subtitle}</div>
            <div>{andList(googleBooksItem?.volumeInfo?.authors)}</div>
            <div>{googleBooksItem?.volumeInfo?.categories?.join(", ")}</div>
            <div>
              {googleBooksItem?.volumeInfo?.publisher || ""}
              {googleBooksItem?.volumeInfo?.publisher &&
              googleBooksItem?.volumeInfo?.pageCount
                ? ", "
                : ""}
              {googleBooksItem?.volumeInfo?.pageCount
                ? `${googleBooksItem?.volumeInfo?.pageCount}pp.`
                : ""}
            </div>
            {googleBooksItem?.volumeInfo?.publishedDate && (
              <div>
                {dayjs(googleBooksItem?.volumeInfo?.publishedDate).format(
                  "D MMMM YYYY"
                )}
              </div>
            )}
            <div style={{ marginBottom: 16, fontStyle: "italic" }}>
              {googleBooksItem?.volumeInfo?.description}
            </div>
            <div>{googleBooksItem?.volumeInfo?.categories?.join(", ")}</div>
            <div>
              {`Print Type: ${googleBooksItem?.volumeInfo?.printType || ""}`}
            </div>
            <div>
              {`Maturity Rating: ${
                googleBooksItem?.volumeInfo?.maturityRating || ""
              }`}
            </div>
            <div>
              {`Language: ${googleBooksItem?.volumeInfo?.language || ""}`}
            </div>
            {googleBooksItem?.saleInfo?.saleability !== "NOT_FOR_SALE" && (
              <>
                <div>
                  {`List Price: $${
                    googleBooksItem?.saleInfo?.listPrice?.amount || ""
                  }
            ${googleBooksItem?.saleInfo?.listPrice?.currencyCode}`}
                </div>
                <div>
                  {`Retail Price: $${
                    googleBooksItem?.saleInfo?.retailPrice?.amount || ""
                  }
                      ${googleBooksItem?.saleInfo?.retailPrice?.currencyCode}
                      `}
                </div>
              </>
            )}
          </div>
        ) : googleBooksOptions ? (
          <div>
            {googleBooksOptions.map((opt: any, i: number) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr",
                  gap: 16,
                  cursor: "pointer",
                  marginBottom: 16,
                  alignContent: "flex-start",
                  justifyContent: "flex-start",
                }}
                onClick={() => handleGoogleBooksOptionClick(opt)}
              >
                <div className="w-32">
                  <div className="w-32 h-32 relative">
                    <Image
                      layout="fill"
                      objectFit="contain"
                      src={
                        opt?.volumeInfo?.imageLinks?.smallThumbnail ||
                        `${process.env.NEXT_PUBLIC_RESOURCE_URL}img/default.png`
                      }
                      alt={
                        googleBooksItem?.volumeInfo?.title || "Book cover art"
                      }
                    />
                    {/*<div className="absolute w-32 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center">
                    {getItemSku(item)}
                  </div>*/}
                  </div>
                </div>
                <div>
                  <div className="font-bold">
                    {opt?.volumeInfo?.title || ""}
                  </div>
                  <div>{andList(opt?.volumeInfo?.authors || [])}</div>
                  <div>
                    {opt?.volumeInfo?.publisher || ""}
                    {opt?.volumeInfo?.pageCount
                      ? `, ${opt?.volumeInfo?.pageCount}pp.`
                      : ""}
                  </div>
                  {opt?.volumeInfo?.publishedDate && (
                    <div>
                      {dayjs(opt?.volumeInfo?.publishedDate).format(
                        "D MMMM YYYY"
                      )}
                    </div>
                  )}
                </div>
              </div>
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
