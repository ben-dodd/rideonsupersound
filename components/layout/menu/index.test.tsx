import { fireEvent, render, screen } from '@testing-library/react'
import Menu from './index'
import mockRouter from 'next-router-mock'

jest.mock('next/router', () => require('next-router-mock'))

beforeEach(() => {
  mockRouter.setCurrentUrl('/sell')
})

describe('Menu', () => {
  it('renders an image', () => {
    render(<Menu />)
    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
  })

  it('highlights the current page', () => {
    render(<Menu />)
    const listItems = screen.getAllByRole('listitem')
    const sellListItem = listItems[0]
    const inventoryListItem = listItems[1]
    expect(sellListItem).toHaveClass('bg-black')
    expect(sellListItem).toHaveTextContent('SELL')
    expect(inventoryListItem).not.toHaveClass('bg-black')
    expect(inventoryListItem).toHaveTextContent('INVENTORY')
  })

  it('goes to a new page when clicked', () => {
    render(<Menu />)
    const listItems = screen.getAllByRole('listitem')

    const inventoryListItem = listItems[1]
    expect(inventoryListItem).toHaveTextContent('INVENTORY')
    fireEvent.click(inventoryListItem)
    expect(mockRouter.pathname).toBe('/inventory')

    const vendorListItem = listItems[2]
    expect(vendorListItem).toHaveTextContent('VENDORS')
    expect(vendorListItem).not.toHaveClass('bg-black')
    fireEvent.click(vendorListItem)
    expect(mockRouter.pathname).toBe('/vendor')
    expect(vendorListItem).toHaveClass('bg-black')
  })
})
