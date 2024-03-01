import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Title from 'features/sell/inventory-scroll/list-item/title'

jest.mock('next/router', () => jest.requireActual('next-router-mock'))

describe('<Title />', () => {
  it('displays a regular artist/title', async () => {
    render(<Title item={{ title: 'Abbey Road', artist: 'The Beatles ' }} />)

    expect(screen.queryAllByRole('generic')[2]).toHaveTextContent('Abbey Road')
    expect(screen.queryAllByRole('generic')[3]).toHaveTextContent('The Beatles')
  })

  it('displays a displayAs title with artist', async () => {
    render(
      <Title
        item={{
          title: 'Abbey Road',
          displayAs: 'Abbey Road (Special Edition)',
          artist: 'The Beatles ',
        }}
      />,
    )

    expect(screen.queryAllByRole('generic')[2]).toHaveTextContent('Abbey Road (Special Edition)')
    expect(screen.queryAllByRole('generic')[3]).toHaveTextContent('The Beatles')
  })

  it('displays a displayAs title with no artist', async () => {
    render(<Title item={{ displayAs: 'Abbey Road (Special Edition)' }} />)

    expect(screen.queryAllByRole('generic')[2]).toHaveTextContent('Abbey Road (Special Edition)')
    expect(screen.queryAllByRole('generic')[3]).toHaveTextContent('')
  })

  it('displays Untitled if there is no title', async () => {
    render(<Title item={{}} />)

    expect(screen.queryAllByRole('generic')[2]).toHaveTextContent('Untitled')
    expect(screen.queryAllByRole('generic')[3]).toHaveTextContent('')
  })
})
