import StocktakeListScreen from 'features/inventory/features/stocktake/components/stocktake-list-screen'
import StocktakeTemplateScreen from 'features/inventory/features/stocktake/components/stocktake-template-screen'
import { loadedStocktakeTemplateIdAtom, pageAtom } from 'lib/atoms'
import { useAtom } from 'jotai'

export default function StocktakePage() {
  const [loadedStocktakeTemplateId] = useAtom(loadedStocktakeTemplateIdAtom)
  const [page] = useAtom(pageAtom)

  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== 'stocktake' ? 'hidden' : ''
      }`}
    >
      {page === 'stocktake' && <StocktakeListScreen />}
      {loadedStocktakeTemplateId ? <StocktakeTemplateScreen /> : <div />}
    </div>
  )
}
