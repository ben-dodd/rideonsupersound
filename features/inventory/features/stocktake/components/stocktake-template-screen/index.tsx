// Packages
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'

// DB
import {
  clerkAtom,
  loadedStocktakeIdAtom,
  loadedStocktakeTemplateIdAtom,
  viewAtom,
} from 'lib/atoms'
import {
  useAllSelects,
  useInventory,
  useStocktakeItemsByStocktake,
  useStocktakesByTemplate,
  useStocktakeTemplates,
  useVendors,
} from 'lib/database/read'
import {
  ModalButton,
  StockObject,
  StocktakeObject,
  StocktakeStatuses,
  StocktakeTemplateObject,
} from 'lib/types'

// Functions
import {
  saveStocktakeToDatabase,
  updateStocktakeTemplateInDatabase,
} from 'lib/db-functions'

// Components
import ScreenContainer from 'components/container/screen'
import TextField from 'components/inputs/text-field'
import { writeStocktakeFilterDescription } from 'lib/data-functions'
import FilterBox from './filter-box'
import StocktakeListItem from './stocktake-list-item'

import AddIcon from '@mui/icons-material/Add'
import dayjs from 'dayjs'
import StocktakeScreen from '../stocktake-screen'

export default function StocktakeTemplateScreen() {
  // Atoms
  const { inventory, mutateInventory } = useInventory()
  const { selects, isSelectsLoading } = useAllSelects()
  const { vendors, isVendorsLoading } = useVendors()

  const [stocktakeId, setLoadedStocktakeId] = useAtom(loadedStocktakeIdAtom)
  const [stocktakeTemplateId, setLoadedStocktakeTemplateId] = useAtom(
    loadedStocktakeTemplateIdAtom
  )

  const { stocktakes, isStocktakesLoading, mutateStocktakes } =
    useStocktakesByTemplate(stocktakeTemplateId)
  const {
    stocktakeTemplates,
    isStocktakeTemplatesLoading,
    mutateStocktakeTemplates,
  } = useStocktakeTemplates()

  const stocktake = stocktakes?.filter(
    (stocktake) => stocktake?.id === stocktakeId
  )?.[0]
  const { isStocktakeItemsLoading } = useStocktakeItemsByStocktake(
    stocktake?.id
  )
  const stocktakeTemplate = stocktakeTemplates?.filter(
    (st) => st?.id === stocktakeTemplateId
  )?.[0]

  const [view, setView] = useAtom(viewAtom)
  const [clerk] = useAtom(clerkAtom)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const inventoryList = inventory?.filter(
      (i: StockObject) =>
        i?.quantity > 0 &&
        (stocktakeTemplate?.vendor_enabled
          ? stocktakeTemplate?.vendor_list?.includes(i?.vendor_id)
          : true) &&
        (stocktakeTemplate?.format_enabled
          ? stocktakeTemplate?.format_list?.includes(i?.format)
          : true) &&
        (stocktakeTemplate?.media_enabled
          ? stocktakeTemplate?.media_list?.includes(i?.media)
          : true) &&
        (stocktakeTemplate?.section_enabled
          ? stocktakeTemplate?.section_list?.includes(i?.section)
          : true)
    )

    const newStocktakeTemplate = {
      ...stocktakeTemplate,
      total_estimated: inventoryList?.reduce(
        (prev, curr) => prev + curr?.quantity,
        0
      ),
      total_unique_estimated: inventoryList?.length,
      filter_description: writeStocktakeFilterDescription(stocktakeTemplate),
    }
    updateStocktakeTemplateInDatabase(newStocktakeTemplate)
    mutateStocktakeTemplates(
      stocktakeTemplates?.map((st) =>
        st?.id === stocktakeTemplateId ? newStocktakeTemplate : st
      ),
      false
    )
    // }
  }, [
    inventory,
    stocktakeTemplate?.vendor_enabled,
    stocktakeTemplate?.vendor_list,
    stocktakeTemplate?.format_enabled,
    stocktakeTemplate?.format_list,
    stocktakeTemplate?.media_enabled,
    stocktakeTemplate?.media_list,
    stocktakeTemplate?.section_enabled,
    stocktakeTemplate?.section_list,
  ])

  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      hidden: Boolean(stocktakeTemplate?.id),
      onClick: () => {
        setView({ ...view, stocktakeTemplateScreen: false })
        setLoadedStocktakeTemplateId(null)
      },
      text: 'CANCEL',
    },
    {
      type: 'ok',
      loading: isLoading,
      disabled: isLoading,
      text: `${stocktakeTemplate?.id ? 'OK' : 'SAVE AND CLOSE'}`,
      onClick: async () => {
        updateStocktakeTemplateInDatabase(stocktakeTemplate)
        mutateStocktakeTemplates(
          stocktakeTemplates?.map((s) =>
            s?.id === stocktakeTemplate?.id ? stocktakeTemplate : s
          ),
          false
        )
        setView({ ...view, stocktakeTemplateScreen: false })
        setLoadedStocktakeTemplateId(null)
        // }
      },
    },
  ]

  const stocktakeInProgress =
    stocktakes?.filter((s) => !s?.date_cancelled && !s?.date_closed)?.length > 0

  function setLoadedStocktakeTemplate(newTemplate: StocktakeTemplateObject) {
    // console.log(newTemplate);
    updateStocktakeTemplateInDatabase(newTemplate)
    mutateStocktakeTemplates(
      stocktakeTemplates?.map((st) =>
        st?.id === newTemplate?.id ? newTemplate : st
      ),
      false
    )
  }

  return (
    <>
      <ScreenContainer
        show={view?.stocktakeTemplateScreen}
        closeFunction={() => {
          setView({ ...view, stocktakeTemplateScreen: false })
          setLoadedStocktakeTemplateId(null)
        }}
        loading={
          isStocktakeTemplatesLoading ||
          isStocktakesLoading ||
          isStocktakeItemsLoading ||
          isSelectsLoading ||
          isVendorsLoading ||
          isLoading
        }
        title={`${
          stocktakeTemplate?.id
            ? `${stocktakeTemplate?.name?.toUpperCase?.()} STOCKTAKE`
            : 'NEW STOCKTAKE TEMPLATE'
        }`}
        buttons={buttons}
        titleClass="bg-col1"
      >
        <div className="flex flex-col w-full overflow-y-scroll">
          <div className="flex mt-4">
            <div className="w-2/3">
              <div className="flex justify-between">
                <div className="font-bold">STOCKTAKE HISTORY</div>
                <button
                  className="icon-text-button"
                  onClick={async () => {
                    setIsLoading(true)
                    updateStocktakeTemplateInDatabase({
                      ...stocktakeTemplate,
                      status: StocktakeStatuses?.inProgress,
                    })
                    let newStocktake: StocktakeObject = {
                      date_started: dayjs.utc().format(),
                      started_by: clerk?.id,
                      stocktake_template_id: stocktakeTemplate?.id,
                      total_estimated: stocktakeTemplate?.total_estimated,
                      total_unique_estimated:
                        stocktakeTemplate?.total_unique_estimated,
                    }
                    const id = await saveStocktakeToDatabase(newStocktake)
                    mutateStocktakes(
                      [{ ...newStocktake, id }, ...stocktakes],
                      false
                    )
                    setView({ ...view, stocktakeScreen: true })
                    setLoadedStocktakeId(id)
                    setIsLoading(false)
                  }}
                  disabled={
                    stocktakeInProgress || !Boolean(stocktakeTemplateId)
                  }
                >
                  <AddIcon className="pr-2" />
                  New Stocktake
                </button>
              </div>
              {stocktakes?.length === 0 ? (
                <div>No Stocktakes</div>
              ) : (
                stocktakes?.map((s) => (
                  <StocktakeListItem key={s?.id} stocktake={s} />
                ))
              )}
            </div>
            <div className="w-1/3 px-4">
              <div className="font-bold">STOCKTAKE SETUP</div>
              <TextField
                value={stocktakeTemplate?.name || ''}
                onChange={(e: any) =>
                  setLoadedStocktakeTemplate({
                    ...stocktakeTemplate,
                    name: e.target.value,
                  })
                }
                inputLabel="NAME"
              />
              <div className="w-100 bg-red-200">
                <div className="p-2">
                  <div className="italic">
                    {stocktakeTemplate?.filter_description}
                  </div>
                  <div className="flex">
                    <div className="mr-2">
                      Estimated Number of Items in Stock:{' '}
                    </div>
                    <div className="font-bold">
                      {stocktakeTemplate?.total_estimated || '0'}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="mr-2">
                      Estimated Number of Unique Items:{' '}
                    </div>
                    <div className="font-bold">
                      {stocktakeTemplate?.total_unique_estimated || '0'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="font-bold pt-2">STOCKTAKE FILTERS</div>
              <FilterBox
                title="Format"
                list={selects
                  ?.filter((s) => s?.setting_select === 'format')
                  ?.map((s) => ({ label: s?.label, value: s?.label }))}
                stocktakeTemplate={stocktakeTemplate}
                setStocktakeTemplate={setLoadedStocktakeTemplate}
                field={'format'}
              />
              <FilterBox
                title="Section"
                list={selects
                  ?.filter((s) => s?.setting_select === 'section')
                  ?.map((s) => ({ label: s?.label, value: s?.label }))}
                stocktakeTemplate={stocktakeTemplate}
                setStocktakeTemplate={setLoadedStocktakeTemplate}
                field={'section'}
              />
              <FilterBox
                title="Vendors"
                list={vendors?.map((v) => ({
                  label: `${v?.name} [${v?.id}]`,
                  value: v?.id,
                }))}
                stocktakeTemplate={stocktakeTemplate}
                setStocktakeTemplate={setLoadedStocktakeTemplate}
                field={'vendor'}
              />
              <FilterBox
                title="Media Type"
                list={selects
                  ?.filter((s) => s?.setting_select === 'media')
                  ?.map((s) => ({ label: s?.label, value: s?.label }))}
                stocktakeTemplate={stocktakeTemplate}
                setStocktakeTemplate={setLoadedStocktakeTemplate}
                field={'media'}
              />
            </div>
          </div>
        </div>
      </ScreenContainer>
      {/* <StocktakeScreen /> */}
      {stocktakeId && <StocktakeScreen />}
    </>
  )
}
