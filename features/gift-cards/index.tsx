import MidScreenContainer from 'components/container/mid-screen'
import SearchInput from 'components/inputs/search-input'
import { useGiftCards } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import React, { useState } from 'react'
import GiftCardListItem from './gift-card-list-item'

const GiftCardScreen = () => {
  const [searchValue, setSearchValue] = useState('')
  const { loadedGiftCardId } = useAppStore()
  const handleSearch = (e) => setSearchValue(e.target.value)
  const { giftCards, isGiftCardsLoading } = useGiftCards()
  return (
    <MidScreenContainer title="Gift Cards" isLoading={isGiftCardsLoading} titleClass="bg-col8" full={!loadedGiftCardId}>
      <div className="h-content overflow-y-scroll">
        <div className="px-2">
          <SearchInput searchValue={searchValue} handleSearch={handleSearch} />
        </div>
        <div className="px-2">
          {giftCards
            ?.filter?.((giftCard) => giftCard?.giftCardCode?.toUpperCase?.()?.includes(searchValue?.toUpperCase()))
            ?.sort((a, b) => b?.giftCardIsValid - a?.giftCardIsValid)
            ?.map((giftCard) => (
              <GiftCardListItem key={giftCard?.id} giftCard={giftCard} />
            ))}
        </div>
      </div>
    </MidScreenContainer>
  )
}

export default GiftCardScreen
