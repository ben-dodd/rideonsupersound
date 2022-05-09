import { Switch } from "@mui/material";

export default function FilterBox({
  title,
  list,
  stocktake,
  setStocktake,
  field,
}) {
  console.log(stocktake);
  const enabled = stocktake?.[`${field}Enabled`];
  const dataList = stocktake?.[`${field}List`];
  return (
    <div className={`p-2 border${enabled ? "" : " bg-gray-400"}`}>
      <div className="flex justify-between border-b mb-2">
        <div className="flex align-center">
          <div className="mr-2">
            <input
              disabled={!enabled}
              type="checkbox"
              className="cursor-pointer"
              checked={dataList?.length === list?.length}
              onChange={(e) =>
                setStocktake({
                  ...stocktake,
                  [`${field}List`]:
                    dataList?.length === list?.length
                      ? []
                      : list?.map((l) => l?.value),
                })
              }
            />
          </div>
          <div className="font-bold">{title}</div>
        </div>
        <div>
          <Switch
            size="small"
            color="warning"
            checked={enabled}
            onChange={(e) =>
              setStocktake({ ...stocktake, [`${field}Enabled`]: !enabled })
            }
          />
        </div>
      </div>
      <div className="h-dialogsm overflow-y-scroll">
        {list
          ?.sort((a, b) => a?.label?.localeCompare(b?.label))
          ?.map((l) => (
            <div className="flex hover:bg-gray-200" key={l?.label}>
              <div className="mr-2">
                <input
                  type="checkbox"
                  disabled={!enabled}
                  className="cursor-pointer"
                  checked={dataList?.includes(l?.value)}
                  onChange={(e) =>
                    setStocktake({
                      ...stocktake,
                      [`${field}List`]: dataList?.includes(l?.value)
                        ? dataList?.filter((d) => d !== l?.value)
                        : [...dataList, l?.value],
                    })
                  }
                />
              </div>
              <div>{l?.label}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
