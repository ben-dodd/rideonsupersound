// Packages
import { MouseEventHandler } from "react";

// Components
import Image from "next/image";

// Icons
import { DiscogsItem } from "@/lib/types";

interface discogsProps {
  opt: DiscogsItem;
  onClick: MouseEventHandler<HTMLDivElement>;
}

export default function DiscogsOption({ opt, onClick }: discogsProps) {
  return (
    <div
      className="flex item-start cursor-pointer p-2 mb-8 hover:bg-gray-300"
      onClick={onClick}
    >
      <div className="w-32">
        <div className="w-32 h-32 relative">
          <Image
            layout="fill"
            objectFit="cover"
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
              {opt?.barcode?.map((barcode: string) => (
                <div key={barcode}>{barcode}</div>
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
