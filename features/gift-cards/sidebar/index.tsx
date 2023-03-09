import { CloseRounded } from '@mui/icons-material'
import SidebarContainer from 'components/container/side-bar'
import Loading from 'components/placeholders/loading'
import dayjs from 'dayjs'
import { useGiftCard } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { centsToDollars } from 'lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const GiftCardSidebar = () => {
  const { giftCardsPage, setPage } = useAppStore()
  const router = useRouter()
  const { giftCard, isGiftCardLoading } = useGiftCard(giftCardsPage?.loadedGiftCard)
  console.log(giftCard)
  const { giftCard: card = {}, saleTransactions } = giftCard || {}
  const closeSidebar = () => setPage(Pages.giftCardsPage, { loadedGiftCard: 0 })
  return (
    <SidebarContainer show={Boolean(giftCardsPage?.loadedGiftCard)}>
      {isGiftCardLoading ? (
        <Loading />
      ) : (
        <div>
          <div className="flex justify-between items-start h-header">
            <div />
            <div className="text-4xl font-mono py-2">{card?.giftCardCode}</div>
            <button className="mt-2" onClick={closeSidebar}>
              <CloseRounded />
            </button>
          </div>
          <div className="p-4">
            {card?.giftCardIsValid ? (
              <div className="text-xl mb-2 text-green-200">VALID</div>
            ) : (
              <div className="text-xl mb-2 text-red-200">NOT VALID</div>
            )}
            <div>
              <span>{`Purchased on ${dayjs(card?.dateCreated).format('DD/MM/YYYY')}`}</span>{' '}
              {card?.saleId && (
                <a
                  className="link-blue"
                  onClick={() => router.push(`/sales/${card?.saleId}`)}
                >{`[Sale #${card?.saleId}]`}</a>
              )}
            </div>
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
                          className="link-blue pl-2"
                        >{`[Sale #${trans?.saleId}]`}</Link>
                      </div>
                      <div>{`$${centsToDollars(trans?.amount)}`}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </SidebarContainer>
  )
}

export default GiftCardSidebar
