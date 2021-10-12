import { useState, useMemo, useEffect } from "react";
import { useAtom } from "jotai";
import { showReceiveItemsScreenAtom, clerkAtom } from "@/lib/atoms";
import { useInventory, useVendors } from "@/lib/swr-hooks";
import CreateableSelect from "@/components/inputs/createable-select";
import { VendorObject, InventoryObject } from "@/lib/types";

// Actions
import {
  getProfitMargin,
  getCSVData,
  getItemDisplayName,
  fFileDate,
} from "@/lib/data-functions";
import { receiveStock, saveLog } from "@/lib/db-functions";

// Material UI Components
import { CSVLink } from "react-csv";
import Modal from "@/components/modal";
import TextField from "@/components/inputs/text-field";
import Select from "react-select";
import EditableTable from "@/components/table/editable";
import SettingsSelect from "@/components/inputs/settings-select";

// Material UI Icons
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

// Images
import defaultImage from "../../res/default.png";

export default function ReceiveStockScreen() {
  const [showReceiveStockScreen, setShowReceiveStockScreen] = useAtom(
    showReceiveItemsScreenAtom
  );
  const [clerk] = useAtom(clerkAtom);
  const { inventory } = useInventory();
  const { vendors } = useVendors();
  const [obj, setObj]: [any, Function] = useState({});
  const columns = useMemo(
    () => [
      {
        Header: "Artist/Author",
        accessor: "artist",
        // Cell: ({ cell }) => (
        //   <TextField
        //     id={cell?.row?.id}
        //     value={cell?.value}
        //     onChange={(e) =>
        //       updateNewStockData(
        //         cell?.row?.index,
        //         cell?.column?.id,
        //         e.target.value
        //       )
        //     }
        //   />
        // ),
      },
      {
        Header: "Title",
        accessor: "title",
        // Cell: ({ cell }) => (
        //   <TextField
        //     id={cell?.row?.id}
        //     value={cell?.value}
        //     onChange={(e) =>
        //       updateNewStockData(
        //         cell?.row?.index,
        //         cell?.column?.id,
        //         e.target.value
        //       )
        //     }
        //   />
        // ),
      },
      {
        Header: "Vendor Price",
        accessor: "cost",
        width: 120,
        Cell: ({ cell }) => (
          <TextField
            startAdornment="$"
            inputType="number"
            min={0}
            id={cell?.row?.id}
            value={cell?.value}
            onChange={(e: any) =>
              updateNewStockData(
                cell?.row?.index,
                cell?.column?.id,
                e.target.value
              )
            }
          />
        ),
      },
      {
        Header: "Store Price",
        accessor: "sell",
        width: 120,
        Cell: ({ cell }) => {
          return (
            <TextField
              startAdornment="$"
              inputType="number"
              min={0}
              id={cell?.row?.id}
              value={cell?.value}
              onChange={(e: any) =>
                updateNewStockData(
                  cell?.row?.index,
                  cell?.column?.id,
                  e.target.value
                )
              }
            />
          );
        },
      },
      {
        Header: "Store Cut",
        accessor: "storeCut",
        width: 120,
        Cell: ({ row }) => <StoreCut row={row} />,
      },
      {
        Header: "Margin",
        accessor: "margin",
        width: 120,
        Cell: ({ row }) => <Margin row={row} />,
      },
      {
        Header: "Count",
        accessor: "quantityReceived",
        width: 90,
        Cell: ({ cell }) => {
          return (
            <TextField
              id={cell?.row?.id}
              value={cell?.value}
              inputType="number"
              min={0}
              onChange={(e) =>
                updateNewStockData(
                  cell?.row?.index,
                  cell?.column?.id,
                  e.target.value
                )
              }
            />
          );
        },
      },
    ],
    []
  );

  const makeNewStockData = (num) => {
    return [...Array.from(Array(num).keys())].map((num: number) => ({
      num,
      artist: "",
      title: "",
      cost: "",
      sell: "",
      quantityReceived: "",
    }));
  };
  const [newStockData, setNewStockData] = useState(() => makeNewStockData(5));
  const [skipPageReset, setSkipPageReset] = useState(false);
  const updateNewStockData = (rowIndex, columnId, value) => {
    setSkipPageReset(true);
    setNewStockData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  useEffect(() => {
    setSkipPageReset(false);
  }, [newStockData]);

  return (
    <div>
      <div className="flex">
        <div className="w-2/3">
          <div className="font-bold text-xl mt-4">Select Vendor</div>
          <CreateableSelect
            inputLabel="Select vendor"
            fieldRequired
            value={obj?.vendor_id}
            label={
              (vendors || []).filter(
                (v: VendorObject) => v?.id === obj?.vendor_id
              )[0]?.name || ""
            }
            onChange={(vendorObject: any) => {
              setObj({
                ...obj,
                vendor_id: parseInt(vendorObject?.value),
              });
            }}
            onCreateOption={(inputValue: string) =>
              // setCreateContactScreen({
              //   id: 1,
              //   name: inputValue,
              // })
              null
            }
            options={(vendors || [])?.map((val: VendorObject) => ({
              value: val?.id,
              label: val?.name || "",
            }))}
          />
          <div className="font-bold text-xl mt-4">Add Items</div>
          <div className="flex justify-between items-center">
            <Select
              className="w-full text-xs"
              isDisabled={!obj?.vendor_id}
              value={null}
              options={(inventory || [])
                .filter(
                  (item: InventoryObject) =>
                    item?.vendor_id === obj?.vendor_id && !obj?.items[item?.id]
                )
                .map((item: InventoryObject) => ({
                  value: item?.id,
                  label: getItemDisplayName(item),
                }))}
              onChange={(item: any) => {
                // console.log(item);
                setObj({
                  ...obj,
                  items: { ...(obj?.items || {}), [item?.value]: 1 },
                });
              }}
            />

            <button
              className="icon-text-button"
              disabled={!obj?.vendor_id}
              onClick={() =>
                // dispatch(
                //   openDialog("inventory", {
                //     id: ("00000" + nextItemId).slice(-5),
                //     vendor: get(obj, "vendorId", null),
                //     sku: `${("000" + get(obj, "vendorId", "")).slice(-3)}/${(
                //       "00000" + nextItemId
                //     ).slice(-5)}`,
                //     title: "",
                //     artist: "",
                //     quantity: 0,
                //     createdBy: get(currentStaff, "id"),
                //     newItem: true,
                //     onClose: () => {
                //       addLog(
                //         `New inventory item created from receive stock dialog.`,
                //         "inventory",
                //         ("00000" + nextItemId).slice(-5),
                //         currentStaff
                //       );
                //       setObj({
                //         ...obj,
                //         items: {
                //           ...get(obj, "items", {}),
                //           [`${("00000" + nextItemId).slice(-5)}`]: 1,
                //         },
                //       });
                //     },
                //   })
                // )
                null
              }
            >
              <AddIcon className="mr-1" />
              New Item
            </button>
          </div>
          <div>
            <div className="font-bold text-xl mt-4">Quick Add Items</div>
            <EditableTable
              columns={columns}
              data={newStockData}
              skipPageReset={skipPageReset}
              updateData={updateNewStockData}
              color="col2"
            />
            {/*<div className="flex justify-end">
              <button className="icon-text-button" onClick={quickAddItems}>
                <AddIcon className="mr-1" />
                Quick Add Items
              </button>
            </div>*/}
          </div>
        </div>
        <div className="w-1/3 ml-4">
          <div className="mt-6 mb-2">
            <div className="flex justify-between">
              <div className="font-bold text-xl">Current Items</div>
              <div className="font-bold mr-12">Quantity Received</div>
            </div>
            {Object.keys(obj?.items || {}).length > 0 ? (
              Object.entries(obj?.items || {}).map(([itemId, itemQuantity]) => {
                const item: InventoryObject = (inventory || []).filter(
                  (i: InventoryObject) => i?.id === parseInt(itemId)
                )[0];
                return (
                  <div className="flex justify-between my-2 border-b">
                    <div className="flex">
                      <img
                        src={item?.image_url}
                        alt={item?.title}
                        className="inventory-item-image-small"
                      />
                      <div className="ml-2">
                        {getItemDisplayName(item)}
                        <div
                          className={`mt-2 text-sm font-bold ${
                            item?.quantity <= 0 ? "text-tertiary" : "text-black"
                          }`}
                        >{`${item?.quantity} in stock.`}</div>
                      </div>
                    </div>
                    <div className="self-center flex items-center">
                      <TextField
                        className="w-12 mr-6"
                        inputType="number"
                        min={0}
                        value={`${itemQuantity}`}
                        onChange={(e: any) =>
                          setObj({
                            ...obj,
                            items: {
                              ...(obj?.items || []),
                              [itemId]: e.target.value,
                            },
                          })
                        }
                      />
                      <button
                        className="bg-gray-200 hover:bg-gray-300 p-1 w-10 h-10 rounded-full mr-8"
                        onClick={() => {
                          let newItems = obj?.items || {};
                          delete newItems[itemId];
                          setObj({ ...obj, newItems });
                        }}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>Select vendor to start adding items.</div>
            )}
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="dialog-action__button-div mb-4">
          <button
            className="dialog-action__cancel-button mr-2"
            onClick={() => setShowReceiveStockScreen(false)}
          >
            CANCEL
          </button>
          {isDisabled() ? (
            <button className="dialog-action__button mx-2" disabled>
              PRINT LABELS
            </button>
          ) : (
            <CSVLink
              className="dialog-action__second-button mx-2 text-center"
              data={getCSVData(
                Object.entries(obj?.items || {}).map(([id, quantity]) => ({
                  printQuantity: parseFloat(`${quantity}`),
                  item: { value: id },
                })),
                inventory
              )}
              headers={[
                "SKU",
                "ARTIST",
                "TITLE",
                "NEW/USED",
                "SELL PRICE",
                "GENRE",
              ]}
              filename={`label-print-${fFileDate()}.csv`}
              onClick={() =>
                saveLog({
                  log: "Labels printed from receive stock dialog.",
                  clerk_id: clerk?.id,
                })
              }
            >
              PRINT LABELS
            </CSVLink>
          )}
          <button
            className="dialog-action__ok-button ml-2"
            disabled={isDisabled()}
            onClick={async () => {
              await receiveStock(newStockData, obj, clerk);
              setShowReceiveStockScreen(false);
            }}
          >
            RECEIVE ITEMS
          </button>
        </div>
      </div>
    </div>
  );

  function isDisabled() {
    return (
      !obj?.vendor_id ||
      Object.keys(obj?.items || {}).length === 0 ||
      Object.values(obj?.items || {}).filter(
        (itemQuantity) => !Number.isInteger(parseInt(`${itemQuantity}`))
      ).length > 0
    );
  }

  function Margin({ row }) {
    return (
      <div
        className={`${
          parseFloat(row?.original?.sell) - parseFloat(row?.original?.cost) < 0
            ? "text-red-600"
            : "text-black"
        } flex h-full items-center`}
      >
        {!isNaN(parseFloat(row?.original?.cost)) &&
        !isNaN(parseFloat(row?.original?.sell))
          ? getProfitMargin(row?.original)
          : ""}
      </div>
    );
  }

  function StoreCut({ row }) {
    return (
      <div
        className={`${
          parseFloat(row?.original?.sell) - parseFloat(row?.original?.cost) < 0
            ? `text-red-600`
            : `text-black`
        } flex h-full items-center`}
      >
        {!isNaN(parseFloat(row?.original?.cost)) &&
        !isNaN(parseFloat(row?.original?.sell))
          ? `${
              parseFloat(row?.original?.sell) -
                parseFloat(row?.original?.cost) <
              0
                ? "-"
                : ""
            }$${Math.abs(
              parseFloat(row?.original?.sell) - parseFloat(row?.original?.cost)
            ).toFixed(2)}`
          : ""}
      </div>
    );
  }
}
