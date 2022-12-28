import { saveSystemLog } from 'lib/functions/log'
import { StocktakeTemplateObject } from 'lib/types'
import NewIcon from '@mui/icons-material/AddBox'
import { useState } from 'react'
import { useClerk } from 'lib/api/clerk'
import { createStocktakeTemplate } from 'lib/api/stock'
import { useRouter } from 'next/router'

export default function StocktakeNavActions() {
  const { clerk } = useClerk()
  const router = useRouter()
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
            formatEnabled: true,
          }
          const id = await createStocktakeTemplate(newStocktakeTemplate, clerk)
          router.push(`/stocktake/template/${id}`)
          setIsLoading(false)
        }}
      >
        <NewIcon className="mr-1" />
        New Stocktake Template
      </button>
    </div>
  )
}
