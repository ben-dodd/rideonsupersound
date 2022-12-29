import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ItemDetails from 'features/sell/inventory-scroll/list-item/item-details'
import { testItem } from '../../__data__/testItems'

describe('<ItemDetails />', () => {
  it('displays simple item details', async () => {
    render(<ItemDetails item={testItem} />)

    expect(screen.queryAllByRole('generic')[2]).toHaveTextContent(
      'PUN / Cassette [NEAR MINT (NM OR M-)]'
    )
    expect(screen.queryAllByRole('generic')[3]).toHaveTextContent(
      'Selling for Nick White'
    )
  })
})
