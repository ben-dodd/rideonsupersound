import { StockObject } from 'lib/types'

export function mapGiftCardObject(giftCard: StockObject) {
  return {
    id: giftCard?.id,
    code: giftCard?.giftCardCode,
    date: giftCard?.dateCreated,
    initial: giftCard?.giftCardAmount,
    remaining: giftCard?.giftCardRemaining,
    valid: giftCard?.giftCardIsValid,
    notes: giftCard?.note,
  }
}
