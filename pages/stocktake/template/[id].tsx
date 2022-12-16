import StocktakeTemplateScreen from 'features/inventory/features/stocktake/components/stocktake-template-screen'
import { useRouter } from 'next/router'

export default function StocktakePage() {
  const router = useRouter()
  const id = router.query.id
  return <StocktakeTemplateScreen />
}
