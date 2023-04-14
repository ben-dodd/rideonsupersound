import { useEffect, useState } from 'react'
import { ModalButton } from 'lib/types'
import { checkDefaultChecked, writeKiwiBankBatchFile, writePaymentNotificationEmail } from 'lib/functions/payment'
import CheckBatchPayments from './check-batch-payments'
import SelectBatchPayments from './select-batch-payments'
import { useAppStore } from 'lib/store'
import { useCurrentRegisterId } from 'lib/api/register'
import { useClerk } from 'lib/api/clerk'
import { createVendorBatchPayment, useVendorAccounts } from 'lib/api/vendor'
import { ViewProps } from 'lib/store/types'
import Modal from 'components/modal'
import { centsToDollars, dollarsToCents } from 'lib/utils'
import dayjs from 'dayjs'

export default function BatchPaymentDialog() {
  const { view, closeView, openConfirm } = useAppStore()
  const { registerId } = useCurrentRegisterId()
  const { clerk } = useClerk()

  const { vendorAccounts, isVendorAccountsLoading } = useVendorAccounts()
  const [vendorList, setVendorList] = useState([])
  const [stage, setStage] = useState(0)
  const [kbbLoaded, setKbbLoaded] = useState(false)
  const [emailed, setEmailed] = useState(false)
  const [includeUnchecked, setIncludeUnchecked] = useState(false)
  const [includeNoBank, setIncludeNoBank] = useState(false)

  const downloadKbbFile = () => {
    let csvContent = writeKiwiBankBatchFile({
      transactions: vendorList
        ?.filter((v) => v?.isChecked)
        ?.map((vendor: any) => ({
          name: vendor?.name || '',
          vendorId: `${vendor?.id || ''}`,
          accountNumber: vendor?.bankAccountNumber || '',
          amount: dollarsToCents(vendor?.payAmount),
        })),
      batchNumber: `${registerId}`,
      sequenceNumber: 'Batch',
    })
    var link = document.createElement('a')
    link.setAttribute('href', csvContent)
    link.setAttribute('download', `batch-payment-${dayjs().format('YYYY-MM-DD')}.kbb`)
    document.body.appendChild(link)
    link.click()
    setKbbLoaded(true)
  }

  const downloadEmailList = () => {
    let csvContent = writePaymentNotificationEmail({
      vendorList,
      includeUnchecked,
      includeNoBank,
    })
    var link = document.createElement('a')
    link.setAttribute('href', csvContent)
    link.setAttribute('download', `batch-payment-email-list-${dayjs().format('YYYY-MM-DD')}.csv`)
    document.body.appendChild(link)
    link.click()
    setEmailed(true)
  }

  useEffect(() => {
    setVendorList(
      vendorAccounts
        ?.map((vendorAccount) => ({
          ...vendorAccount,
          isChecked: checkDefaultChecked(vendorAccount),
          payAmount: centsToDollars(vendorAccount?.totalOwing).toFixed(2),
        }))
        ?.sort((a, b) => {
          if (!a?.isChecked && b?.isChecked) return 1
          if (!b?.isChecked && a?.isChecked) return -1
          return b?.totalOwing - a?.totalOwing
        }),
    )
  }, [vendorAccounts])

  const buttons: ModalButton[] = false
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
          text: 'DOWNLOAD AND COMPLETE',
          // disabled: !kbbLoaded,
          onClick: () => {
            // if (!emailed) {
            //   openConfirm({
            //     open: true,
            //     title: 'Hang On!',
            //     styledMessage: (
            //       <span>
            //         {`You haven't downloaded the Email CSV. Are you sure you
            //         want to close the page?`}
            //       </span>
            //     ),
            //     yesText: "YES, I'M SURE",
            //     action: () => {
            //       // saveSystemLog(`Batch Payment closed without Emailing`, clerk?.id)
            //       closeView(ViewProps.batchVendorPaymentDialog)
            //       createVendorBatchPayment({ vendorList, clerkId: clerk?.id, registerId, emailed })
            //     },
            //   })
            // } else {
            // saveSystemLog(`Batch Payment closed with Emailing`, clerk?.id)
            downloadKbbFile()
            downloadEmailList()
            closeView(ViewProps.batchVendorPaymentDialog)
            createVendorBatchPayment({ vendorList, clerkId: clerk?.id, registerId, emailed })
            // }
          },
        },
      ]

  return (
    <Modal
      open={view?.batchVendorPaymentDialog}
      closeFunction={() => closeView(ViewProps.batchVendorPaymentDialog)}
      title={'BATCH PAYMENTS'}
      buttons={buttons}
      loading={isVendorAccountsLoading}
      width={'max-w-full'}
    >
      <>
        <div className="w-full" hidden={stage === 1}>
          <SelectBatchPayments vendorList={vendorList} setVendorList={setVendorList} />
        </div>
        <div className="w-full" hidden={stage === 0}>
          <CheckBatchPayments vendorList={vendorList} setKbbLoaded={setKbbLoaded} setEmailed={setEmailed} />
        </div>
      </>
    </Modal>
  )
}
