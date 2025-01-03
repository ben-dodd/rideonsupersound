import { useState } from 'react'

const MinMaxInput = ({ onChange, initMin, initMax }) => {
  const [min, setMin] = useState(initMin)
  const [max, setMax] = useState(initMax)
  // const debounce = 500

  const handleMin = (e) => {
    setMin(e.target.value)
    onChange([e.target.value, max])
    // checkMax()
  }
  const handleMax = (e) => {
    setMax(e.target.value)
    onChange([min, e.target.value])
    // checkMin()
  }

  // const checkMax = () => {
  //   const timeout = setTimeout(() => {
  //     if (max < min) handleMax({ e: { target: { value: min } } })
  //   }, debounce)

  //   return () => clearTimeout(timeout)
  // }
  // const checkMin = () => {
  //   const timeout = setTimeout(() => {
  //     if (min > max) handleMin({ e: { target: { value: max } } })
  //   }, debounce)

  //   return () => clearTimeout(timeout)
  // }

  return (
    <div className="filter-input flex">
      <input className="w-1/2" type="number" value={min} onChange={handleMin} placeholder="Min" />
      <input className="w-1/2" type="number" value={max} onChange={handleMax} placeholder="Max" />
    </div>
  )
}

export default MinMaxInput
