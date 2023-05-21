import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { GiftCardObject } from 'lib/types/stock'
import { centsToDollars } from 'lib/utils'
import React from 'react'

const GiftCardListItem = ({ giftCard }: { giftCard: GiftCardObject }) => {
  const { setPage } = useAppStore()
  return (
    <div
      className={`list-item-click${!giftCard?.giftCardIsValid ? ' text-red-500' : ''}`}
      onClick={() => setPage(Pages.giftCardsPage, { loadedGiftCard: giftCard?.id })}
    >
      <div className="ml-2 font-mono">{giftCard?.giftCardCode}</div>
      <div className="pr-4">{`$${centsToDollars(giftCard?.giftCardRemaining)} / $${centsToDollars(
        giftCard?.giftCardAmount,
      )}`}</div>
    </div>
  )
}

export default GiftCardListItem
