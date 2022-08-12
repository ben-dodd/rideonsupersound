import { render, screen } from '@testing-library/react'
// import { act } from 'react-dom/test-utils'
import Menu from './index'

// jest.mock('axios')

describe('Menu', () => {
  it('renders an image', () => {
    render(<Menu />)
    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
  })
})
