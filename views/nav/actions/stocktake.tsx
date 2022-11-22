import { clerkAtom, loadedStocktakeTemplateIdAtom, viewAtom } from 'lib/atoms'
import { useAtom } from 'jotai'

import { saveSystemLog } from 'features/log/lib/functions'
import { createStocktakeTemplateInDatabase } from 'lib/database/create'
import { useStocktakeTemplates } from 'lib/database/read'
import { StocktakeTemplateObject } from 'lib/types'
import NewIcon from '@mui/icons-material/AddBox'
import { useState } from 'react'

export default function StocktakeNavActions() {
  const [view, setView] = useAtom(viewAtom)
  const { stocktakeTemplates, mutateStocktakeTemplates } =
    useStocktakeTemplates()
  const [, setLoadedStocktakeTemplateId] = useAtom(
    loadedStocktakeTemplateIdAtom
  )
  const [clerk] = useAtom(clerkAtom)
  const [isLoading, setIsLoading] = useState(false)
  return (
    <div className="flex">
      <button
        disabled={isLoading}
        className="icon-text-button"
        onClick={async () => {
          setIsLoading(true)
          saveSystemLog('Stocktake Nav - New Stocktake clicked.', clerk?.id)
          let newStocktakeTemplate: StocktakeTemplateObject = {
            format_enabled: true,
          }
          const id = await createStocktakeTemplateInDatabase(
            newStocktakeTemplate
          )
          mutateStocktakeTemplates(
            [{ id, format_enabled: true, name: '' }, ...stocktakeTemplates],
            false
          )
          setLoadedStocktakeTemplateId(id)
          setView({ ...view, stocktakeTemplateScreen: true })
          setIsLoading(false)
        }}
      >
        <NewIcon className="mr-1" />
        New Stocktake Template
      </button>
    </div>
  )
}
