import { useState, useEffect } from "react";
import Image from "next/image";
// Actions
import {
  andList,
  getGoogleBooksOptions,
  getGoogleBooksItem,
} from "@/lib/data-functions";
import { format, parseISO } from "date-fns";
import nz from "date-fns/locale/en-NZ";

// Material UI Icons
import SyncIcon from "@material-ui/icons/Sync";

export default function GoogleBooksPanel({ item, setItem }) {
  const [googleBooksOptions, setGoogleBooksOptions] = useState(null);
  const googleBooksItem = item?.discogsItem;

  useEffect(() => {
    if (
      item?.media === "Literature" &&
      !Boolean(item?.googleBooksItem) &&
      (Boolean(item?.artist) || Boolean(item?.title))
    )
      getGoogleBooksOptions(item, setGoogleBooksOptions);
  }, [item]);

  return (
    <div>
      <div className="flex justify-between">
        <Image
          src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/google-books-logo.png`}
          alt="GoogleBooks Logo"
          width="100px"
          height="50px"
        />
        <button
          className="icon-text-button"
          onClick={() => {
            setItem({ ...item, googleBooksItem: null });
            getGoogleBooksOptions(item, setGoogleBooksOptions);
          }}
        >
          <SyncIcon /> Refresh GoogleBooks Search
        </button>
      </div>
      {googleBooksItem ? (
        <div className="pt-4">
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
          <div className="font-bold">{googleBooksItem?.volumeInfo?.title}</div>
          <div>{googleBooksItem?.volumeInfo?.subtitle}</div>
          <div>{andList(googleBooksItem?.volumeInfo?.authors || [])}</div>
          <div>
            {(googleBooksItem?.volumeInfo?.categories || []).join(", ")}
          </div>
          <div>
            {googleBooksItem?.volumeInfo?.publisher || ""}
            {googleBooksItem?.volumeInfo?.pageCount
              ? `, ${googleBooksItem?.volumeInfo?.pageCount}pp.`
              : ""}
          </div>
          {googleBooksItem?.volumeInfo?.publishedDate && (
            <div>
              {format(
                parseISO(googleBooksItem?.volumeInfo?.publishedDate),
                "d MMMM yyyy",
                { locale: nz }
              )}
            </div>
          )}
          <div style={{ marginBottom: 16, fontStyle: "italic" }}>
            {googleBooksItem?.volumeInfo?.description}
          </div>
          <div>
            {(googleBooksItem?.volumeInfo?.categories || []).join(", ")}
          </div>
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
          <div>
            {`List Price: $${googleBooksItem?.saleInfo?.listPrice?.amount || ""}
            ${googleBooksItem?.saleInfo?.listPrice?.currencyCode}`}
          </div>
          <div>
            {`Retail Price: $${
              googleBooksItem?.saleInfo?.retailPrice?.amount || ""
            }
                      ${googleBooksItem?.saleInfo?.retailPrice?.currencyCode}
                      `}
          </div>
        </div>
      ) : googleBooksOptions ? (
        <div>
          {googleBooksOptions.map((opt: any) => (
            <div
              key={opt?.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: 16,
                cursor: "pointer",
                marginBottom: 16,
                alignContent: "flex-start",
                justifyContent: "flex-start",
              }}
              onClick={() => getGoogleBooksItem(opt, item, setItem)}
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
                    alt={googleBooksItem?.volumeInfo?.title || "Book cover art"}
                  />
                  {/*<div className="absolute w-32 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center">
                    {getItemSku(item)}
                  </div>*/}
                </div>
              </div>
              <div>
                <div className="font-bold">{opt?.volumeInfo?.title || ""}</div>
                <div>{andList(opt?.volumeInfo?.authors || [])}</div>
                <div>
                  {opt?.volumeInfo?.publisher || ""}
                  {opt?.volumeInfo?.pageCount
                    ? `, ${opt?.volumeInfo?.pageCount}pp.`
                    : ""}
                </div>
                {opt?.volumeInfo?.publishedDate && (
                  <div>
                    {format(
                      parseISO(opt?.volumeInfo?.publishedDate),
                      "d MMMM yyyy",
                      { locale: nz }
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
  );
}
