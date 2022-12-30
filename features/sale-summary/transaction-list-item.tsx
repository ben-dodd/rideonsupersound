import dayjs from 'dayjs'
import { useGiftCards } from 'lib/api/stock'
import { useVendorFromVendorPayment } from 'lib/api/vendor'
import { PaymentMethodTypes, SaleTransactionObject } from 'lib/types/sale'
import { GiftCardObject } from 'lib/types/stock'

export default function TransactionListItem({ transaction }: { transaction: SaleTransactionObject }) {
  const { giftCards } = useGiftCards()
  const { vendor = {} } = useVendorFromVendorPayment(transaction?.vendorPayment || 0)
  const giftCard = giftCards?.find((g: GiftCardObject) => g?.id === transaction?.giftCardId)

  return (
    <div
      className={`flex justify-end items-center mt-2 mb-3 ${
        transaction?.isDeleted ? 'line-through text-gray-400' : transaction?.isRefund ? 'text-red-500' : 'text-blue-500'
      }`}
    >
      <div className="w-1/2">{dayjs(transaction?.date).format('D MMMM YYYY, h:mm A')}</div>
      <div className="w-1/4">
        {(`${transaction?.paymentMethod}${transaction?.isRefund ? ' REFUND' : ''}` || 'OTHER').toUpperCase()}
      </div>
      <div className="w-1/4">
        <div className="text-right">
          ${(transaction?.isRefund ? transaction?.amount / -100 : transaction?.amount / 100 || 0)?.toFixed(2)}
        </div>
        <div className="text-right text-xs">
          {transaction?.paymentMethod === PaymentMethodTypes.Cash
            ? transaction?.isRefund
              ? ''
              : transaction?.changeGiven
              ? `($${(transaction.changeGiven / 100)?.toFixed(2)} CHANGE)`
              : '(NO CHANGE)'
            : transaction?.paymentMethod === PaymentMethodTypes.Account
            ? `[${(vendor?.name || transaction?.vendor?.name || '').toUpperCase()}]`
            : transaction?.paymentMethod === PaymentMethodTypes.GiftCard
            ? transaction?.giftCardTaken
              ? transaction?.changeGiven
                ? `CARD TAKEN, $${(transaction?.giftCardChange / 100)?.toFixed(2)} CHANGE [${(
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
