
import Layout from 'components/layout'
import RegistersScreen from 'features/register'
import { useAppStore } from 'lib/store'
import dynamic from 'next/dynamic'

const ReturnCashDialog = dynamic(() => import('features/register/return-cash'))
const TakeCashDialog = dynamic(() => import('features/register/take-cash'))

function RegistersPage() {
  const { view } = useAppStore()
  return (
    <div className={`flex relative overflow-x-hidden`}>
      <RegistersScreen />
      {view?.returnCashDialog && <ReturnCashDialog />}
      {view?.takeCashDialog && <TakeCashDialog />}
    </div>
  )
}

RegistersPage.getLayout = (page) => <Layout>{page}</Layout>

export default RegistersPage
