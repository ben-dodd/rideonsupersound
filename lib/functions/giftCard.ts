import { StockItemObject } from 'lib/types/stock'

export function mapGiftCardObject(giftCard: StockItemObject) {
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
