import MidScreenContainer from 'components/container/mid-screen'
import { useSalesForRange } from 'lib/hooks/sales'
import { useAppStore } from 'lib/store'
import SalesListView from './display-sales/sale-list'

const SalesScreen = () => {
  const { salesPage } = useAppStore()
  const salesViewRange = {}
  const { isLoading } = useSalesForRange(salesViewRange)
  return (
    <MidScreenContainer title="SALES" isLoading={isLoading} titleClass="bg-col5" full={true}>
      <SalesListView />
    </MidScreenContainer>
  )
}

export default SalesScreen
