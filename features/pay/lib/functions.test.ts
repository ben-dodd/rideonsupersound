import { roundToTenCents } from './functions'

describe('roundToTenCents', () => {
  it('should round to ten cents', () => {
    expect(roundToTenCents(5.15)).toBe(5.2)
    expect(roundToTenCents(0)).toBe(0)
    expect(roundToTenCents(5.14)).toBe(5.1)
    expect(roundToTenCents(5.2)).toBe(5.2)
    expect(roundToTenCents(0.12)).toBe(0.1)
    expect(roundToTenCents(0.04)).toBe(0)
  })
})
