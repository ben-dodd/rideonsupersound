import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ItemImage from 'features/sell/inventory-scroll/list-item/item-image'
// import { getImageSrc, getItemSku } from 'lib/functions/displayInventory'
// jest.mock('lib/functions/displayInventory')
// TODO learn how to mock the getimagesrc etc.

describe('<ItemImage />', () => {
  it('shows an image with the getImageSrc value', async () => {
    render(
      <ItemImage
        item={{
          title: 'Abbey Road',
          artist: 'The Beatles',
          quantity: 2,
          imageUrl: 'test.jpg',
        }}
      />
    )

    expect(screen.getByRole('img')).toHaveAttribute('src', 'test.jpg')
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Abbey Road')
  })
})
