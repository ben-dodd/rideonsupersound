import { Switch } from "@mui/material";

export default function FilterBox({
  title,
  list,
  stocktakeTemplate,
  setStocktakeTemplate,
  field,
}) {
  // console.log(stocktake);
  const enabled = Boolean(stocktakeTemplate?.[`${field}_enabled`]) || false;
  const dataList = stocktakeTemplate?.[`${field}_list`] || [];
  // console.log(dataList);
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
                setStocktakeTemplate({
                  ...stocktakeTemplate,
                  [`${field}_list`]:
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
              setStocktakeTemplate({
                ...stocktakeTemplate,
                [`${field}_enabled`]: !enabled,
              })
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
                    setStocktakeTemplate({
                      ...stocktakeTemplate,
                      [`${field}_list`]: dataList?.includes(l?.value)
                        ? dataList?.filter?.((d) => d !== l?.value)
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
