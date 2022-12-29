import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Quantities from 'features/sell/inventory-scroll/list-item/quantities'

describe('<Quantities />', () => {
  it('should show the correct quantities (no holds or laybys)', async () => {
    render(<Quantities item={{}} itemQuantity={4} />)

    expect(screen.queryAllByRole('generic')[2]).toHaveTextContent('4 in stock')
  })

  it('should show the correct quantities for holds', async () => {
    render(
      <Quantities
        item={{
          quantityHold: -2,
        }}
        itemQuantity={4}
      />
    )

    expect(screen.queryAllByRole('generic')[2]).toHaveTextContent(
      '4 in stock, 2 on hold'
    )
  })

  it('should show the correct quantities for laybys', async () => {
    render(
      <Quantities
        item={{
          quantityHold: -1,
          quantityUnhold: 1,
          quantityLayby: -1,
        }}
        itemQuantity={4}
      />
    )

    expect(screen.queryAllByRole('generic')[2]).toHaveTextContent(
      '4 in stock, 1 on layby'
    )
  })

  it('should show the correct quantities for laybys and holds', async () => {
    render(
      <Quantities
        item={{
          quantityHold: -3,
          quantityLayby: -2,
          quantityUnlayby: 1,
        }}
        itemQuantity={4}
      />
    )

    expect(screen.queryAllByRole('generic')[2]).toHaveTextContent(
      '4 in stock, 3 on hold, 1 on layby'
    )
  })

  it('should show the price in dollars', async () => {
    render(
      <Quantities
        item={{
          totalSell: 4050,
          quantityHold: -1,
          quantityUnhold: 1,
          quantityLayby: -1,
        }}
        itemQuantity={4}
      />
    )

    expect(screen.queryAllByRole('generic')[3]).toHaveTextContent('$40.50')
  })

  it('should handle zero price', async () => {
    render(<Quantities item={{ totalSell: 0 }} itemQuantity={4} />)

    expect(screen.queryAllByRole('generic')[3]).toHaveTextContent('$0.00')
  })

  it('should handle undefined price', async () => {
    render(<Quantities item={{}} itemQuantity={4} />)

    expect(screen.queryAllByRole('generic')[3]).toHaveTextContent('N/A')
  })
})
