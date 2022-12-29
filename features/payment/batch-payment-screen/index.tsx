// Packages
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'

// DB
import ScreenContainer from 'components/container/screen'
import { logBatchPayment, saveSystemLog } from 'lib/functions/log'
import { ClerkObject, ModalButton } from 'lib/types'
import dayjs from 'dayjs'
import { modulusCheck } from 'lib/functions/payment'
import CheckBatchPayments from './check-batch-payments'
import SelectBatchPayments from './select-batch-payments'
import { useAppStore } from 'lib/store'
import { useCurrentRegister, useCurrentRegisterId } from 'lib/api/register'
import { useClerk } from 'lib/api/clerk'
import { useVendors } from 'lib/api/vendor'
import { ViewProps } from 'lib/store/types'

// Icons

export default function BatchPaymentScreen() {
  const { view, closeView, openConfirm } = useAppStore()
  const { registerId } = useCurrentRegisterId()
  const { clerk } = useClerk()

  const { inventory, isInventoryLoading } = useInventory()
  const { sales, isSalesLoading } = useSalesJoined()
  const { vendorPayments, isVendorPaymentsLoading, mutateVendorPayments } =
    useVendorPayments()
  const { currentRegister } = useCurrentRegister()
  const { vendors, isVendorsLoading } = useVendors()
  // const { logs, mutateLogs } = useLogs()

  const [vendorList, setVendorList] = useState([])
  const [stage, setStage] = useState(0)
  const [kbbLoaded, setKbbLoaded] = useState(false)
  const [emailed, setEmailed] = useState(false)

  useEffect(
    () => {
      let vList = []
      vendors
        ?.filter((vendor) => vendor?.id !== 666)
        ?.forEach((v) => {
          let vendorVars = getVendorDetails(
            inventory,
            sales,
            vendorPayments,
            v?.id
          )
          vList.push({
            ...v,
            ...vendorVars,
            is_checked: checkValid({ ...v, ...vendorVars }),
            payAmount: (
              (vendorVars?.totalOwing > 0 ? vendorVars?.totalOwing : 0) / 100
            )?.toFixed(2),
          })
        })
      setVendorList(
        vList?.sort((a, b) => {
          if (!a?.is_checked && b?.is_checked) return 1
          if (!b?.is_checked && a?.is_checked) return -1
          return b?.totalOwing - a?.totalOwing
        })
      )
    },
    [
      // isVendorsLoading,
      // isInventoryLoading,
      // isSalesLoading,
      // isVendorPaymentsLoading,
    ]
  )

  const checkValid = (vendor) =>
    modulusCheck(vendor?.bank_account_number) &&
    !vendor?.store_credit_only &&
    (vendor?.totalOwing >= 2000 ||
      (dayjs().diff(vendor?.lastPaid, 'month') >= 3 &&
        vendor?.totalOwing > 0) ||
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
            disabled:
              vendorList?.reduce(
                (prev, v) =>
                  isNaN(parseFloat(v?.payAmount)) ? prev + 1 : prev,
                0
              ) > 0,
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
                    saveSystemLog(
                      `Batch Payment closed without Emailing`,
                      clerk?.id
                    )
                    closeView(ViewProps.batchVendorPaymentScreen)
                    completeBatchPayment(
                      vendorList,
                      clerk,
                      registerId,
                      emailed,
                      vendorPayments,
                      mutateVendorPayments
                    )
                  },
                })
              } else {
                saveSystemLog(`Batch Payment closed with Emailing`, clerk?.id)
                closeView(ViewProps.batchVendorPaymentScreen)
                completeBatchPayment(
                  vendorList,
                  clerk,
                  registerId,
                  emailed,
                  vendorPayments,
                  mutateVendorPayments
                )
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
      loading={
        isInventoryLoading ||
        isVendorPaymentsLoading ||
        isVendorsLoading ||
        isSalesLoading
      }
    >
      <>
        <div className="w-full" hidden={stage === 1}>
          <SelectBatchPayments
            vendorList={vendorList}
            setVendorList={setVendorList}
          />
        </div>
        <div className="w-full" hidden={stage === 0}>
          <CheckBatchPayments
            vendorList={vendorList}
            setKbbLoaded={setKbbLoaded}
            setEmailed={setEmailed}
          />
        </div>
      </>
    </ScreenContainer>
  )
}

function completeBatchPayment(
  vendorList: any[],
  clerk: ClerkObject,
  registerID: number,
  emailed: boolean,
  vendorPayments: any,
  mutateVendorPayments: Function
) {
  console.log(vendorList)
  if (emailed) {
    console.log(vendorList?.filter((v) => v?.is_checked))
    vendorList
      ?.filter((v) => v?.is_checked)
      ?.forEach((v) => {
        updateVendorInDatabase({
          id: v?.id,
          lastContacted: dayjs.utc().format(),
        })
      })
  }
  vendorList
    ?.filter(
      (v) =>
        v?.is_checked &&
        modulusCheck(v?.bank_account_number) &&
        parseFloat(v?.payAmount)
    )
    ?.forEach(async (vendor: any) => {
      let vendorPayment = {
        amount: Math.round(parseFloat(vendor?.payAmount || '0') * 100),
        date: dayjs.utc().format(),
        bank_account_number: vendor?.bank_account_number,
        batchNumber: `${registerID}`,
        sequenceNumber: 'Batch',
        clerk_id: clerk?.id,
        vendor_id: vendor?.id,
        register_id: registerID,
        type: 'batch',
      }
      // console.log(vendorPayment);
      createVendorPaymentInDatabase(vendorPayment).then((vendorPaymentId) => {
        mutateVendorPayments([
          ...vendorPayments,
          { ...vendorPayment, vendorPaymentId },
        ])
        logBatchPayment(vendor, clerk, vendorPaymentId)
      })
    })
}
