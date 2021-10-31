// Packages
import { useState, useEffect } from "react";

// Functions
import {
  getDiscogsOptions,
  getDiscogsItem,
  andList,
} from "@/lib/data-functions";

// Components
import Image from "next/image";
import ReactPlayer from "react-player";

// Icons
import SyncIcon from "@mui/icons-material/Sync";

export default function DiscogsPanel({ item, setItem, exchangeRate }) {
  // State
  const [discogsOptions, setDiscogsOptions] = useState(null);

  // Constants
  const discogsItem = item?.discogsItem || null;

  // Load
  useEffect(() => {
    if (
      (item?.media === "Audio" &&
        Boolean(item?.discogsItem) &&
        Boolean(item?.artist)) ||
      Boolean(item?.title)
    )
      getDiscogsOptions(item, setDiscogsOptions);
  }, []);
  console.log(item);
  return (
    <div className="flex flex-col h-inventory">
      <div className="flex justify-between px-2">
        <Image
          src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/discogs-logo.png`}
          alt="Discogs Logo"
          width="100px"
          height="50px"
        />
        <button
          className="icon-text-button hover:text-blue-600"
          onClick={() => {
            setItem({ ...item, discogsItem: null });
            getDiscogsOptions(item, setDiscogsOptions);
          }}
        >
          <SyncIcon /> Refresh Discogs Search
        </button>
      </div>
      <div className="flex-1 overflow-y-auto pt-4 mx-4">
        {discogsItem ? (
          <div>
            {/* HEADER DETAILS */}
            <div className="text-xl">
              <div className="font-bold">
                {andList((discogsItem?.artists || []).map((e: any) => e.name))}
              </div>
              <div className="font-bold italic">
                {`${discogsItem?.title}
                              ${
                                discogsItem?.year
                                  ? ` (${discogsItem?.year})`
                                  : ""
                              }`}
              </div>
            </div>
            <div className="text-md">
              {(discogsItem?.format || []).join(", ")}
            </div>
            <div className="pr-1 italic">
              {`${discogsItem?.label[0] || ""}${
                discogsItem?.label && discogsItem?.country ? ", " : ""
              }${discogsItem?.country || ""}`}
            </div>
            <div className="pt-4 text-sm">
              {(discogsItem?.genres || [])
                .concat(discogsItem?.styles || [])
                .join(", ")}
            </div>
            <div className="pt-2" />
            <div className="p-2">
              {(discogsItem?.barcode || []).length > 0 && (
                <div>
                  <div className="font-bold">Barcodes</div>
                  <div className="text-sm">
                    {(discogsItem?.barcode || []).map(
                      (barcode: string, i: number) => (
                        <div key={i}>{barcode}</div>
                      )
                    )}
                  </div>
                </div>
              )}

              {(discogsItem?.identifiers || []).length > 0 && (
                <div>
                  <div className="pt-2 pb-1 font-bold">Identifiers</div>
                  <div className="text-sm">
                    {(discogsItem?.identifiers || []).map(
                      (id: any, i: number) => (
                        <div key={i}>
                          <b>{id?.type}:</b>
                          {` ${id?.value}${
                            id?.description ? ` (${id.description})` : ""
                          }`}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="pt-2" />
            <div className="p-2 bg-primary-light rounded">
              <div className="font-bold">Suggested Price</div>
              <div>
                {discogsItem?.priceSuggestions &&
                discogsItem?.priceSuggestions[
                  item?.is_new ? "Mint (M)" : item?.cond || "Good (G)"
                ]?.value
                  ? `$${parseFloat(
                      discogsItem?.priceSuggestions[
                        item?.is_new ? "Mint (M)" : item?.cond || "Good (G)"
                      ]?.value
                    )?.toFixed(2)} NZD (${
                      item?.is_new ? "Mint (M)" : item?.cond || "Good (G)"
                    } condition)`
                  : "No Data"}
              </div>
            </div>
            <div className="p-2 bg-secondary-light rounded mt-2">
              <div className="font-bold">Lowest Price on Marketplace</div>
              <div>
                {discogsItem?.lowest_price
                  ? `$${(
                      parseFloat(discogsItem?.lowest_price) *
                      parseFloat(exchangeRate)
                    )?.toFixed(2)} NZD`
                  : "No Data"}
              </div>
            </div>
            <div className="p-2">
              {(discogsItem?.tracklist || []).map((track: any, i: number) => (
                <div className="flex justify-between" key={i}>
                  <div>
                    <b>{track?.position}</b> {track?.title}
                  </div>
                  <div>{track?.duration}</div>
                </div>
              ))}
            </div>
            {(discogsItem?.videos || []).map((vid: any, i: number) => (
              <ReactPlayer
                className="p-2"
                url={vid?.uri}
                key={i}
                controls={true}
                width={"100%"}
              />
            ))}
          </div>
        ) : discogsOptions ? (
          discogsOptions.length > 0 ? (
            <div>
              {discogsOptions.map((opt: any, i: number) => (
                <div
                  key={i}
                  className="flex item-start cursor-pointer p-2 mb-8 hover:bg-gray-300"
                  onClick={() => {
                    getDiscogsItem(opt, item, setItem);
                  }}
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
                    <div>{(opt?.format || []).join(", ")}</div>
                    <div>{opt?.country || ""}</div>
                    <div>{opt?.year || ""}</div>

                    {(opt?.barcode || []).length > 0 && (
                      <div>
                        <div className="pt-2 pb-1 font-bold">Barcodes</div>
                        <div className="text-sm">
                          {(opt?.barcode || []).map((barcode: string) => (
                            <div key={barcode}>{barcode}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(opt?.identifiers || []).length > 0 && (
                      <div>
                        <div className="pt-2 pb-1 font-bold">Identifiers</div>
                        <div className="text-sm">
                          {(opt?.identifiers || []).map((id: any) => (
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
              ))}
            </div>
          ) : (
            <div className="text-xl p-6">
              No items found on Discogs...
              <br />
              Check the title and artist name.
            </div>
          )
        ) : (
          <div className="text-xl p-6">
            To search item on Discogs, fill in the title and artist on the left
            and click the button above.
          </div>
        )}
      </div>
      <div />
    </div>
  );
}
// TODO make discogs list more searchable
