import SidebarContainer from 'components/container/side-bar'
import Loading from 'components/loading'
import dayjs from 'dayjs'
import { useGiftCard } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { centsToDollars } from 'lib/utils'
import Link from 'next/link'
import React from 'react'

const GiftCardSidebar = () => {
  const { loadedGiftCardId } = useAppStore()
  const { giftCard, isGiftCardLoading } = useGiftCard(loadedGiftCardId)
  console.log(giftCard)
  const { giftCard: card = {}, saleTransactions } = giftCard || {}
  return (
    <SidebarContainer show={Boolean(loadedGiftCardId)}>
      {isGiftCardLoading ? (
        <Loading />
      ) : (
        <div>
          <div className="text-center text-4xl font-mono pb-4">{card?.giftCardCode}</div>
          <div>{`Created on ${dayjs(card?.dateCreated).format('DD/MM/YYYY')}`}</div>
          <div>{`Initial amount: $${centsToDollars(card?.giftCardAmount)}`}</div>
          <div>{`Total remaining: $${centsToDollars(card?.giftCardRemaining)}`}</div>
          <div className="mt-2">{card?.note}</div>
          <div className="border-t pt-2">
            {saleTransactions?.length === 0 ? (
              'Card has not been used'
            ) : (
              <div>
                {saleTransactions?.map((trans) => (
                  <div key={trans?.id} className="flex justify-between items-center border-b">
                    <div className="flex">
                      <div>{`${dayjs(trans?.date).format('DD/MM/YYYY')}`}</div>
                      <Link
                        href={`/sales/${trans?.saleId}`}
                        className="hover:text-gray-600 pl-2"
                      >{`[Sale #${trans?.saleId}]`}</Link>
                    </div>
                    <div>{`$${centsToDollars(trans?.amount)}`}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </SidebarContainer>
  )
}

export default GiftCardSidebar
