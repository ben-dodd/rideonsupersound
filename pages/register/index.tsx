import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from 'components/layout'
import { useAppStore } from 'lib/store'
import RegistersScreen from 'features/register'
import ReturnCashDialog from 'features/register/return-cash'
import TakeCashDialog from 'features/register/take-cash'

export default function RegistersPage() {
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

export const getServerSideProps = withPageAuthRequired()
