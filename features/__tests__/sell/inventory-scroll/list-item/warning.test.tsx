import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Warning from 'features/sell/inventory-scroll/list-item/warning'

describe('<Warning />', () => {
  it('displays warnings for items that need restocking', async () => {
    render(<Warning item={{ needsRestock: true }} itemQuantity={1} isInCart={false} />)

    expect(screen.queryAllByRole('generic')[1]).toHaveTextContent('PLEASE RESTOCK!')
    expect(screen.queryAllByRole('generic')[1]).toHaveClass('text-yellow-400')
  })

  it('displays warnings for items that are out of stock', async () => {
    render(<Warning item={{}} itemQuantity={0} isInCart={false} />)

    expect(screen.queryAllByRole('generic')[1]).toHaveTextContent('OUT OF STOCK')
    expect(screen.queryAllByRole('generic')[1]).toHaveClass('text-red-400')
  })

  it('displays no warning otherwise', async () => {
    render(<Warning item={{}} itemQuantity={5} isInCart={false} />)

    expect(screen.queryAllByRole('generic')[1]).toHaveTextContent('')
    expect(screen.queryAllByRole('generic')[1]).toHaveClass('text-red-400')
  })
})
