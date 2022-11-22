import { StockObject } from 'lib/types'

export function mapGiftCardObject(giftCard: StockObject) {
  return {
    id: giftCard?.id,
    code: giftCard?.gift_card_code,
    date: giftCard?.date_created,
    initial: giftCard?.gift_card_amount,
    remaining: giftCard?.gift_card_remaining,
    valid: giftCard?.gift_card_is_valid,
    notes: giftCard?.note,
  }
}
