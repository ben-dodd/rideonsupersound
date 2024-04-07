import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Quantities from 'features/sell/inventory-scroll/list-item/quantities'

describe('<Quantities />', () => {
  it('should show the correct quantities (no holds or laybys)', async () => {
    render(<Quantities quantities={{}} price={{ totalSell: 1400 }} itemQuantity={4} isInCart={false} />)
    expect(screen.queryAllByRole('generic')[2]).toHaveTextContent('4 in stock')
  })

  it('should show the correct quantities (no holds or laybys), item in cart', async () => {
    render(<Quantities quantities={{}} price={{ totalSell: 1400 }} itemQuantity={4} isInCart={true} />)
    expect(screen.queryAllByRole('generic')[2]).toHaveTextContent('4 left in stock')
  })

  it('should show the correct quantities for holds', async () => {
    render(
      <Quantities
        quantities={{
          hold: 2,
        }}
        price={{ totalSell: 2000 }}
        itemQuantity={4}
        isInCart={false}
      />,
    )

    expect(screen.queryAllByRole('generic')[2]).toHaveTextContent('4 in stock, 2 on hold')
  })

  it('should show the correct quantities for laybys', async () => {
    render(
      <Quantities
        quantities={{
          hold: 0,
          unhold: 0,
          layby: 1,
        }}
        price={{ totalSell: 1600 }}
        itemQuantity={4}
        isInCart={false}
      />,
    )

    expect(screen.queryAllByRole('generic')[2]).toHaveTextContent('4 in stock, 1 on layby')
  })

  it.todo('should handle holds and unholds before it gets to the Quantities')

  it('should show the correct quantities for laybys and holds', async () => {
    render(
      <Quantities
        quantities={{
          hold: 3,
          layby: 2,
        }}
        price={{ totalSell: 2000 }}
        itemQuantity={4}
        isInCart={true}
      />,
    )

    expect(screen.queryAllByRole('generic')[2]).toHaveTextContent('4 left in stock, 3 on hold, 2 on layby')
  })

  it('should show the price in dollars', async () => {
    render(
      <Quantities
        quantities={{
          hold: 1,
          unhold: 1,
          layby: 1,
        }}
        price={{ totalSell: 4050 }}
        itemQuantity={4}
        isInCart={false}
      />,
    )

    expect(screen.queryAllByRole('generic')[3]).toHaveTextContent('$40.50')
  })

  it('should handle zero price', async () => {
    render(<Quantities quantities={{}} price={{ totalSell: 0 }} itemQuantity={4} isInCart={false} />)

    expect(screen.queryAllByRole('generic')[3]).toHaveTextContent('$0.00')
  })

  it('should handle undefined price', async () => {
    render(<Quantities quantities={{}} itemQuantity={4} price={{}} isInCart={false} />)

    expect(screen.queryAllByRole('generic')[3]).toHaveTextContent('N/A')
  })
})
