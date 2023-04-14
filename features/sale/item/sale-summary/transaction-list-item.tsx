import { Delete } from '@mui/icons-material'
import dayjs from 'dayjs'
import { useGiftCards } from 'lib/api/stock'
import { useVendorFromVendorPayment } from 'lib/api/vendor'
import { useAppStore } from 'lib/store'
import { PaymentMethodTypes, SaleTransactionObject } from 'lib/types/sale'
import { GiftCardObject } from 'lib/types/stock'
import { priceCentsString } from 'lib/utils'

export default function TransactionListItem({
  transaction,
  isEditable,
}: {
  transaction: SaleTransactionObject
  isEditable: boolean
}) {
  const { deleteCartTransaction, openConfirm, closeConfirm } = useAppStore()
  const { giftCards } = useGiftCards()
  const { vendor = {} } = useVendorFromVendorPayment(transaction?.vendorPaymentId)
  const giftCard = giftCards?.find((g: GiftCardObject) => g?.id === transaction?.giftCardId)

  return (
    <div
      className={`flex justify-end items-center mt-2 mb-3 ${
        transaction?.isDeleted ? 'line-through text-gray-400' : transaction?.isRefund ? 'text-red-500' : 'text-blue-500'
      }`}
    >
      {isEditable ? (
        transaction?.isDeleted ? (
          <div className="w-8" />
        ) : (
          <button
            onClick={() => {
              openConfirm({
                open: true,
                title: 'Delete Transaction?',
                message: 'Are you sure you want to delete this transaction?',
                yesText: 'Yes',
                noText: 'No',
                action: () => {
                  deleteCartTransaction(transaction)
                  closeConfirm()
                },
              })
            }}
            className="border-rounded hover:opacity-50 mr-2"
          >
            <Delete />
          </button>
        )
      ) : (
        <div />
      )}
      <div className="w-1/2">{dayjs(transaction?.date).format('D MMMM YYYY, h:mm A')}</div>
      <div className="w-1/4">
        {(`${transaction?.paymentMethod}${transaction?.isRefund ? ' REFUND' : ''}` || 'OTHER').toUpperCase()}
      </div>
      <div className="w-1/4">
        <div className="text-right">{priceCentsString(Math.abs(transaction?.amount))}</div>
        <div className="text-right text-xs">
          {transaction?.paymentMethod === PaymentMethodTypes.Cash
            ? transaction?.isRefund
              ? ''
              : transaction?.changeGiven
              ? `(${priceCentsString(transaction.changeGiven)} CHANGE)`
              : '(NO CHANGE)'
            : transaction?.paymentMethod === PaymentMethodTypes.Account
            ? `[${(vendor?.name || transaction?.vendor?.name || '').toUpperCase()}]`
            : transaction?.paymentMethod === PaymentMethodTypes.GiftCard
            ? transaction?.giftCardTaken
              ? transaction?.changeGiven
                ? `CARD TAKEN, ${priceCentsString(transaction?.changeGiven)} CHANGE [${(
                    giftCard?.giftCardCode || ''
                  ).toUpperCase()}]`
                : `CARD TAKEN [${(giftCard?.giftCardCode || '').toUpperCase()}]`
              : `[${(giftCard?.giftCardCode || transaction?.giftCardUpdate?.giftCardCode || '').toUpperCase()}]`
            : ''}
        </div>
      </div>
    </div>
  )
}
