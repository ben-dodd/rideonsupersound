import { useState } from 'react'
import dynamic from 'next/dynamic'
import Tabs from 'components/navigation/tabs'
import Tab from 'components/navigation/tabs/tab'
const VendorItems = dynamic(() => import('./items'))
const VendorPayments = dynamic(() => import('./payments'))
const VendorSales = dynamic(() => import('./sales'))
import { VendorObject } from 'lib/types/vendor'
import MidScreenContainer from 'components/container/mid-screen'
import GeneralDetails from './general-details'
import { useAppStore } from 'lib/store'
import { Delete, Edit, JoinFull, Summarize } from '@mui/icons-material'
import { ViewProps } from 'lib/store/types'

export default function VendorScreen({ vendor }: { vendor: VendorObject }) {
  const { openView } = useAppStore()
  const [tab, setTab] = useState(0)
  const { sales = [], payments = [], items = [] } = vendor || {}

  const menuItems = [
    { text: 'Edit', icon: <Edit />, onClick: () => openView(ViewProps.vendorEditDialog) },
    { text: 'Export Report', icon: <Summarize />, onClick: () => openView(ViewProps.exportVendorReportDialog) },
    { text: 'Merge Vendors', icon: <JoinFull />, onClick: null },
    { text: 'Delete Vendor', icon: <Delete />, onClick: null },
  ]

  return (
    <MidScreenContainer
      title={`VENDOR ${vendor?.name}`}
      titleClass="bg-brown-dark text-white"
      menuItems={menuItems}
      showBackButton
      full
      dark
    >
      <div className="flex">
        <div className="w-1/4 px-2">
          <GeneralDetails vendor={vendor} />
        </div>
        <div className="w-3/4 px-2">
          <Tabs tabs={['Sales', 'Payments', 'Stock']} value={tab} onChange={setTab} />
          <Tab tab={0} selectedTab={tab}>
            <VendorSales sales={sales} />
          </Tab>
          <Tab tab={1} selectedTab={tab}>
            <VendorPayments payments={payments} />
          </Tab>
          <Tab tab={2} selectedTab={tab}>
            <VendorItems items={items} />
          </Tab>
        </div>
      </div>
    </MidScreenContainer>
  )
}

// // Functions
// function onClickDelete() {
//   // REVIEW Delete inventory item
//   // const itemIsPartOfSale =
//   //   saleItems?.filter((s) => s?.item_id === item?.id)?.length > 0;
//   openConfirm({
//     open: true,
//     title: 'Are you sure you want to delete this item?',
//     styledMessage: (
//       <div>
//         {vendor?.items?.length > 0 ? (
//           <>
//             <div className="text-red-500 text-lg text-center p-2 border-red-500">
//               SORRY
//             </div>
//             <div>
//               This vendor has items assigned to them and cannot be deleted.
//             </div>
//           </>
//         ) : (
//           <div>This will delete the vendor.</div>
//         )}
//       </div>
//     ),
//     yesText: vendor?.items?.length > 0 ? 'OK' : "YES, I'M SURE",
//     action:
//       vendor?.items?.length > 0
//         ? () => {}
//         : async () =>
//             deleteVendor(vendor?.id)?.then(() => {
//               saveLog(
//                 `Vendor #${vendor?.id} ${vendor?.name} deleted.`,
//                 clerk?.id,
//                 'vendor',
//                 vendor?.id
//               )
//               router.back()
//             }),
//   })
// }
