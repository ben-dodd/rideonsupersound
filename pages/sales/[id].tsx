import { useRouter } from 'next/router'
import Layout from 'components/layout'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import SaleItemScreen from 'features/sale/item'

export default function SaleItemPage() {
  const router = useRouter()
  const { id } = router.query
  return <SaleItemScreen id={id} />
}

SaleItemPage.getLayout = (page) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()
