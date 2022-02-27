// Packages
import { MouseEventHandler } from "react";

// Components
import Image from "next/image";

// Icons
import { DiscogsItem, StockObject } from "@/lib/types";
import {
  getDiscogsItem,
  getDiscogsItemArtistDetails,
  getDiscogsPriceSuggestions,
} from "@/lib/data-functions";
import { saveSystemLog } from "@/lib/db-functions";
import { clerkAtom } from "@/lib/atoms";
import { useAtom } from "jotai";

interface discogsProps {
  opt: DiscogsItem;
  item: StockObject;
  setItem: Function;
  override: boolean;
}

export default function DiscogsOption({
  opt,
  item,
  setItem,
  override,
}: discogsProps) {
  const [clerk] = useAtom(clerkAtom);
  const handleDiscogsOptionClick = async () => {
    saveSystemLog(`Discogs option clicked - ${opt?.id}`, clerk?.id);
    const detailedDiscogsItem = await getDiscogsItem(opt);
    const priceSuggestions = await getDiscogsPriceSuggestions(opt);
    console.log(detailedDiscogsItem);
    // const artist = await getDiscogsItemArtistDetails(detailedDiscogsItem);
    const discogsItem = {
      ...opt,
      ...detailedDiscogsItem,
      priceSuggestions,
    };
    console.log(discogsItem);
    if (override)
      item = {
        ...item,
        artist: discogsItem?.artists?.map((artist) => artist?.name)?.join(", "),
        barcode: discogsItem?.barcode?.join("\n"),
        country: discogsItem?.country,
        format: discogsItem?.format?.join(", "),
        media: "Audio",
        genre: [
          ...(discogsItem?.genre
            ? Array.isArray(discogsItem?.genre)
              ? discogsItem?.genre
              : [discogsItem?.genre]
            : []),
          ...(discogsItem?.style
            ? Array.isArray(discogsItem?.style)
              ? discogsItem?.style
              : [discogsItem?.style]
            : []),
        ],
        title: discogsItem?.title,
        release_year: discogsItem?.year?.toString(),
      };
    setItem({
      ...item,
      thumb_url: opt?.thumb || null,
      image_url: opt?.cover_image || null,
      discogsItem,
    });
  };

  return (
    <div
      className="flex item-start cursor-pointer p-2 mb-8 hover:bg-gray-300"
      onClick={handleDiscogsOptionClick}
    >
      <div className="w-32">
        <div className="w-32 h-32 relative">
          <img
            className="object-cover absolute"
            // layout="fill"
            // objectFit="cover"
            src={
              opt?.thumb ||
              `${process.env.NEXT_PUBLIC_RESOURCE_URL}img/default.png`
            }
            alt={opt?.title || "Album art"}
          />
          {/*<div className="absolute w-32 h-8 bg-opacity-50 bg-black text-white flex justify-center items-center">
                      {getItemSku(item)}
                    </div>*/}
        </div>
      </div>
      <div className="w-2/3 ml-6">
        <div className="font-bold">{opt?.title || ""}</div>
        <div>{opt?.format?.join(", ")}</div>
        <div>{opt?.country || ""}</div>
        <div>{opt?.year || ""}</div>

        {opt?.barcode?.length > 0 && (
          <div>
            <div className="pt-2 pb-1 font-bold">Barcodes</div>
            <div className="text-sm">
              {opt?.barcode?.map((barcode: string, i: number) => (
                <div key={i}>{barcode}</div>
              ))}
            </div>
          </div>
        )}

        {opt?.identifiers?.length > 0 && (
          <div>
            <div className="pt-2 pb-1 font-bold">Identifiers</div>
            <div className="text-sm">
              {opt?.identifiers?.map((id: any) => (
                <div key={id?.value}>
                  <b>{id?.type}:</b>
                  {` ${id?.value}${
                    id?.description ? ` (${id?.description})` : ""
                  }`}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
