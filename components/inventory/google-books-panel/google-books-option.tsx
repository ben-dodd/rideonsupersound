import { andList } from "@/lib/data-functions";
import dayjs from "dayjs";
import Image from "next/image";

export default function GoogleBooksOption({
  opt,
  handleGoogleBooksOptionClick,
}) {
  return (
    <div
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
            alt={opt?.volumeInfo?.title || "Book cover art"}
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
            {dayjs(opt?.volumeInfo?.publishedDate).format("D MMMM YYYY")}
          </div>
        )}
      </div>
    </div>
  );
}
