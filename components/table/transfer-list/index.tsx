import React, { useEffect, useState } from 'react'
import Filter from '../filter'
import SelectList from '../select-list'

interface TransferListType {
  data: any[]
  isLoading: boolean
  isError?: boolean
  sortFunction?: (a: any, b: any) => number
}

const TransferList = ({ data, isLoading, isError, sortFunction = defaultSortFunction }: TransferListType) => {
  const [sourceData, setSourceData] = useState([])
  const [targetData, setTargetData] = useState([])
  const [sourceSelected, setSourceSelected] = useState([])
  const [targetSelected, setTargetSelected] = useState([])
  const [sourceFilterFunc, setSourceFilterFunc] = useState(() => defaultFilterFunction)
  const [targetFilterFunc, setTargetFilterFunc] = useState(() => defaultFilterFunction)

  useEffect(() => {
    setSourceData(data)
  }, [isLoading])

  const clearAllSelected = () => {
    setSourceSelected([])
    setTargetSelected([])
  }

  const transferAll = () => {
    setSourceData([])
    setTargetData(data)
    clearAllSelected()
  }

  // const transferSelected = () => shuttleSelected()

  const transferSelected = () => {
    setSourceData((sourceData) => sourceData.filter((datum) => !sourceSelected.includes(datum.id)))
    setTargetData((targetData) =>
      [...targetData, ...data.filter((datum) => sourceSelected.includes(datum.id))].sort(sortFunction),
    )
    setSourceSelected([])
  }

  const returnSelected = () => {
    setSourceData((sourceData) =>
      [...sourceData, ...data.filter((datum) => targetSelected.includes(datum.id))].sort(sortFunction),
    )
    setTargetData((targetData) => targetData.filter((datum) => !targetSelected.includes(datum.id)))
    setTargetSelected([])
  }

  const returnAll = () => {
    setSourceData(data)
    setTargetData([])
    clearAllSelected()
  }

  const doubleClickTransfer = (id: number) => {
    setSourceData((sourceData) => sourceData.filter((datum) => datum.id !== id))
    setTargetData((targetData) => [...targetData, ...data.filter((datum) => datum.id === id)].sort(sortFunction))
    setSourceSelected([])
  }

  return (
    <div
      className="flex h-screen"
      onPaste={(evt) => {
        const text = evt.clipboardData.getData('text/plain')
        console.log(text.split('\n').map((line) => line.split('\t')))
      }}
    >
      <div className="w-5/12 p-8">
        <Filter setFilterFunc={setSourceFilterFunc} initFilters={defaultFilter} />
        <SelectList
          data={sourceData.filter(sourceFilterFunc)}
          isLoading={isLoading}
          selected={sourceSelected}
          setSelected={setSourceSelected}
          dblClickCallback={doubleClickTransfer}
        />
      </div>
      <div className="w-2/12 p4 flex flex-col justify-center items-center">
        <button className="btn-elevated-highlight" onClick={transferAll}>
          &gt;&gt;
        </button>
        <button className="btn-elevated" onClick={transferSelected}>
          &gt;
        </button>
        <button className="btn-elevated" onClick={returnSelected}>
          &lt;
        </button>
        <button className="btn-elevated-highlight" onClick={returnAll}>
          &lt;&lt;
        </button>
      </div>
      <div className="w-5/12 p-8">
        <SelectList data={targetData} isLoading={false} selected={targetSelected} setSelected={setTargetSelected} />
      </div>
    </div>
  )
}

const defaultFilterFunction = (row: any) => {
  return true
}

const defaultSortFunction = (a: any, b: any) => {
  return a.id - b.id
}

const defaultFilter = [
  {
    id: 1,
    type: 'text',
    value: '',
    filterConstructor: (val: string) => (row: any) => row.title.toLowerCase().includes(val.toLowerCase()),
  },
]

export default TransferList
