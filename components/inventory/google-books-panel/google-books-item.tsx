import { andList } from "@/lib/data-functions";
import { GoogleBooksItem } from "@/lib/types";
import dayjs from "dayjs";
import Image from "next/image";

interface googleProps {
  googleBooksItem: GoogleBooksItem;
}

export default function GoogleBooksItemDisplay({
  googleBooksItem,
}: googleProps) {
  return (
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
      <div className="font-bold">{googleBooksItem?.volumeInfo?.title}</div>
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
      <div>{`Print Type: ${googleBooksItem?.volumeInfo?.printType || ""}`}</div>
      <div>
        {`Maturity Rating: ${
          googleBooksItem?.volumeInfo?.maturityRating || ""
        }`}
      </div>
      <div>{`Language: ${googleBooksItem?.volumeInfo?.language || ""}`}</div>
      {googleBooksItem?.saleInfo?.saleability !== "NOT_FOR_SALE" && (
        <>
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
        </>
      )}
    </div>
  );
}
