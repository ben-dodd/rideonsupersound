import { getMatrixValue, refInRange } from '../dataTable'

describe('refInRange', () => {
  it('should return true if ref is in the range defined by the topleft and bottomright refs', () => {
    expect(refInRange([0, 0], [0, 0], [0, 0])).toBeTruthy()
    expect(refInRange([10, 15], [2, 5], [10, 21])).toBeTruthy()
    expect(refInRange([0, 0], [0, 1], [10, 5])).toBeFalsy()
  })
})

describe('getMatrixValue', () => {
  it('should return the proper value from the valuematrix, based on the starting cell and the focus cell', () => {
    const valueMatrix = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      ['a', 'b', 'c', 'd'],
      ['x', 'y', 'z'],
    ]
    expect(getMatrixValue([5, 2], [3, 0], valueMatrix)).toBe('c')
    expect(getMatrixValue([6, 3], [3, 0], valueMatrix)).toBe('')
  })
})
