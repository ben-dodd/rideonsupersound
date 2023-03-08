import MidScreenContainer from 'components/container/mid-screen'
import SearchInput from 'components/inputs/search-input'
import { useGiftCards } from 'lib/api/stock'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import GiftCardListItem from './gift-card-list-item'

const GiftCardScreen = () => {
  const { giftCardsPage, setPage, setSearchBar } = useAppStore()
  const handleSearch = (e) => setSearchBar(Pages.giftCardsPage, e.target.value)
  const { giftCards, isGiftCardsLoading } = useGiftCards()
  return (
    <MidScreenContainer
      title="Gift Vouchers"
      isLoading={isGiftCardsLoading}
      titleClass="bg-col8"
      full={!giftCardsPage?.loadedGiftCard}
    >
      <div className="h-content overflow-y-scroll">
        <div className="px-2">
          <SearchInput searchValue={giftCardsPage?.searchBar} handleSearch={handleSearch} />
        </div>
        <div className="px-2">
          {giftCards
            ?.filter?.((giftCard) =>
              giftCard?.giftCardCode?.toUpperCase?.()?.includes(giftCardsPage?.searchBar?.toUpperCase()),
            )
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
