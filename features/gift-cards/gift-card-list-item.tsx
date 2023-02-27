import { useAppStore } from 'lib/store'
import { GiftCardObject } from 'lib/types/stock'
import { centsToDollars } from 'lib/utils'
import React from 'react'

const GiftCardListItem = ({ giftCard }: { giftCard: GiftCardObject }) => {
  const { setLoadedGiftCardId } = useAppStore()
  return (
    <div
      className={`list-item-compact${!giftCard?.giftCardIsValid ? ' line-through text-gray-300' : ''}`}
      onClick={() => setLoadedGiftCardId(giftCard?.id)}
    >
      <div className="ml-2 font-mono">{giftCard?.giftCardCode}</div>
      <div className="pr-4">{`$${centsToDollars(giftCard?.giftCardRemaining)} / $${centsToDollars(
        giftCard?.giftCardAmount,
      )}`}</div>
    </div>
  )
}

export default GiftCardListItem
