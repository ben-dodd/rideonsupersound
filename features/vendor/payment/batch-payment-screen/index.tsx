import { useEffect, useState } from 'react'
import ScreenContainer from 'components/container/screen'
import { ModalButton } from 'lib/types'
import dayjs from 'dayjs'
import { modulusCheck } from 'lib/functions/payment'
import CheckBatchPayments from './check-batch-payments'
import SelectBatchPayments from './select-batch-payments'
import { useAppStore } from 'lib/store'
import { useCurrentRegisterId } from 'lib/api/register'
import { useClerk } from 'lib/api/clerk'
import { useVendorAccounts } from 'lib/api/vendor'
import { ViewProps } from 'lib/store/types'

// Icons

export default function BatchPaymentScreen() {
  const { view, closeView, openConfirm } = useAppStore()
  const { registerId } = useCurrentRegisterId()
  const { clerk } = useClerk()

  const { vendorAccounts, isVendorAccountsLoading } = useVendorAccounts()
  const [vendorList, setVendorList] = useState([])
  const [stage, setStage] = useState(0)
  const [kbbLoaded, setKbbLoaded] = useState(false)
  const [emailed, setEmailed] = useState(false)

  useEffect(() => {
    setVendorList(
      vendorAccounts
        ?.map((vendorAccount) => ({ ...vendorAccount, isChecked: checkDefaultChecked(vendorAccount) }))
        ?.sort((a, b) => {
          if (!a?.isChecked && b?.isChecked) return 1
          if (!b?.isChecked && a?.isChecked) return -1
          return b?.totalOwing - a?.totalOwing
        }),
    )
  }, [vendorAccounts])

  const checkDefaultChecked = (vendor) =>
    modulusCheck(vendor?.bankAccountNumber) &&
    !vendor?.storeCreditOnly &&
    (vendor?.totalOwing >= 2000 ||
      (dayjs().diff(vendor?.lastPaid, 'month') >= 3 && vendor?.totalOwing > 0) ||
      (dayjs().diff(vendor?.lastSold, 'month') >= 3 && !vendor?.lastPaid))
      ? true
      : false

  const buttons: ModalButton[] =
    stage === 0
      ? [
          {
            type: 'ok',
            text: 'NEXT',
            onClick: () => setStage(1),
            disabled: vendorList?.reduce((prev, v) => (isNaN(parseFloat(v?.payAmount)) ? prev + 1 : prev), 0) > 0,
          },
        ]
      : [
          {
            type: 'cancel',
            onClick: () => setStage(0),
            text: 'BACK',
          },
          {
            type: 'ok',
            text: 'OK',
            disabled: !kbbLoaded,
            onClick: () => {
              if (!emailed) {
                openConfirm({
                  open: true,
                  title: 'Hang On!',
                  styledMessage: (
                    <span>
                      {`You haven't downloaded the Email CSV. Are you sure you
                      want to close the page?`}
                    </span>
                  ),
                  yesText: "YES, I'M SURE",
                  action: () => {
                    // saveSystemLog(`Batch Payment closed without Emailing`, clerk?.id)
                    closeView(ViewProps.batchVendorPaymentDialog)
                    createBatchPayment({ vendorList, clerkId: clerk?.id, registerId, emailed })
                  },
                })
              } else {
                // saveSystemLog(`Batch Payment closed with Emailing`, clerk?.id)
                closeView(ViewProps.batchVendorPaymentDialog)
                createBatchPayment({ vendorList, clerkId: clerk?.id, registerId, emailed })
              }
            },
          },
        ]

  return (
    <ScreenContainer
      show={view?.batchVendorPaymentScreen}
      closeFunction={() => closeView(ViewProps.batchVendorPaymentScreen)}
      title={'BATCH PAYMENTS'}
      buttons={buttons}
      titleClass="bg-col4"
      loading={isInventoryLoading || isVendorPaymentsLoading || isVendorsLoading || isSalesLoading}
    >
      <>
        <div className="w-full" hidden={stage === 1}>
          <SelectBatchPayments vendorList={vendorList} setVendorList={setVendorList} />
        </div>
        <div className="w-full" hidden={stage === 0}>
          <CheckBatchPayments vendorList={vendorList} setKbbLoaded={setKbbLoaded} setEmailed={setEmailed} />
        </div>
      </>
    </ScreenContainer>
  )
}
