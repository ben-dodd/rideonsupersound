import { useState } from 'react'
import Tabs from 'components/navigation/tabs'
import VendorItems from './items'
import VendorPayments from './payments'
import VendorSales from './sales'
import { VendorObject } from 'lib/types/vendor'
import MidScreenContainer from 'components/container/mid-screen'
import GeneralDetails from './general-details'
import { useAppStore } from 'lib/store'
import { Edit } from '@mui/icons-material'
import { ViewProps } from 'lib/store/types'

export default function VendorScreen({ vendor }: { vendor: VendorObject }) {
  const { openView } = useAppStore()
  const [tab, setTab] = useState(0)
  const { sales = [], payments = [], items = [] } = vendor || {}

  const menuItems = [
    { text: 'Edit', icon: <Edit />, onClick: () => openView(ViewProps.vendorEditDialog) },
    { text: 'Export Report', icon: <Edit />, onClick: () => openView(ViewProps.exportVendorReportDialog) },
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
          <div hidden={tab !== 0}>
            <VendorSales sales={sales} />
          </div>
          <div hidden={tab !== 1}>
            <VendorPayments payments={payments} />
          </div>
          <div hidden={tab !== 2}>
            <VendorItems items={items} />
          </div>
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
