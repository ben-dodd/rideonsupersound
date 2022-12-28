import { getCashVars, roundToTenCents } from '../pay'

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

describe('getCashVars', () => {
  it('should handle cases where customer gives correct cash', () => {
    expect(getCashVars('20.00', '20', false)).toStrictEqual({
      netAmount: 2000,
      cashFromCustomer: 2000,
      cashToCustomer: null,
    })
  })
  it('should handle cases where customer is given change', () => {
    expect(getCashVars('20', '15', undefined)).toStrictEqual({
      netAmount: 1500,
      cashFromCustomer: 2000,
      cashToCustomer: 500,
    })
  })
  it('should handle cases where customer is refunded cash', () => {
    expect(getCashVars('20', -50, true)).toStrictEqual({
      netAmount: -2000,
      cashFromCustomer: null,
      cashToCustomer: 2000,
    })
  })
})
