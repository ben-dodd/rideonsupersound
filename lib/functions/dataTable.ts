export const getColumnRatios = (schema: any[], stock: any[]) => {
  // TODO Add set widths, resize etc
  const lengths: number[] = []
  schema.forEach((col) => {
    lengths.push(
      Math.max(
        ...stock.map((item: any) => `${col.getValue ? col.getValue(item) : item[col.key]}`.length),
        col.header.length,
      ),
    )
  })
  const totalLength = lengths.reduce((a, b) => a + b, 0)
  const ratios = lengths.map((num) => num / totalLength)
  return ratios
}

export const arraysAreEqual = (arr1: any[], arr2: any[]) => {
  return arr1?.filter((arrEl, i) => arrEl !== arr2[i]).length === 0 && arr1.length === arr2.length
}

export const refInRange = (ref: number[], corner1: number[], corner2: number[]) => {
  const [topLeft, bottomRight] = getSelectionCorners(corner1, corner2)
  return topLeft[0] <= ref[0] && bottomRight[0] >= ref[0] && topLeft[1] <= ref[1] && bottomRight[1] >= ref[1]
}

export const getMatrixValue = (focusCell: number[], initialCell: number[], valueMatrix: any[][]) => {
  const height: number = valueMatrix.length
  const width: number = Math.max(...valueMatrix.map((row) => row.length))
  const rowOffset: number = focusCell[0] - initialCell[0]
  const colOffset: number = focusCell[1] - initialCell[1]
  const valRow = rowOffset % height
  const valCol = colOffset % width
  return valueMatrix[valRow][valCol] === undefined ? '' : valueMatrix[valRow][valCol]
}

export const parseClipboardData = (evt: any) => {
  const pastedText = evt.clipboardData.getData('Text')
  console.log(pastedText)
  return pastedText.split('\n').map((row: string) => row.split('\t'))
}

export const getSelectionCorners = (corner1: number[], corner2: number[]) => {
  const topRow = Math.min(corner1[0], corner2[0])
  const bottomRow = Math.max(corner1[0], corner2[0])
  const leftCol = Math.min(corner1[1], corner2[1])
  const rightCol = Math.max(corner1[1], corner2[1])
  return [
    [topRow, leftCol],
    [bottomRow, rightCol],
  ]
}
