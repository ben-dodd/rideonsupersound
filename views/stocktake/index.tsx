// Packages
import { useAtom } from 'jotai'

// DB
import StocktakeListScreen from '@features/inventory/features/stocktake/components/stocktake-list-screen'
import StocktakeTemplateScreen from '@features/inventory/features/stocktake/components/stocktake-template-screen'
import { loadedStocktakeTemplateIdAtom, pageAtom } from '@lib/atoms'

// Components
// import ListStockMovement from "./list-stock-movement";

export default function StocktakePage() {
  // SWR
  const [loadedStocktakeTemplateId] = useAtom(loadedStocktakeTemplateIdAtom)

  // Atoms
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
