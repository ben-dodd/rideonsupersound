import ItemImage from 'features/sell/inventory-scroll/list-item/item-image'
import { useAppStore } from 'lib/store'
import { GiftCardObject } from 'lib/types/stock'
import { centsToDollars } from 'lib/utils'
import React from 'react'

const GiftCardListItem = ({ giftCard }: { giftCard: GiftCardObject }) => {
  const { setLoadedGiftCardId } = useAppStore()
  return (
    <div
      className={`list-item hover:bg-gray-200 cursor-pointer items-center justify-between${
        !giftCard?.giftCardIsValid ? ' line-through text-gray-200' : ''
      }`}
      onClick={() => setLoadedGiftCardId(giftCard?.id)}
    >
      <div className="flex items-center">
        <ItemImage item={giftCard} width="w-imageSmall" faded={!giftCard?.giftCardIsValid} />
        <div className="ml-2 text-4xl font-mono">{giftCard?.giftCardCode}</div>
      </div>
      <div className="text-4xl pr-4">{`$${centsToDollars(giftCard?.giftCardRemaining)} / $${centsToDollars(
        giftCard?.giftCardAmount,
      )}`}</div>
    </div>
  )
}

export default GiftCardListItem
