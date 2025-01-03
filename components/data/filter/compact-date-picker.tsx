import React, { useState } from 'react'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { dateDMY } from 'lib/types/date'

dayjs.extend(isBetween)
dayjs.extend(customParseFormat)

const CompactDateRangePicker = ({ onApply, initStartDate = null, initEndDate = null }) => {
  const [showPicker, setShowPicker] = useState(false)
  const [startDate, setStartDate] = useState(initStartDate)
  const [endDate, setEndDate] = useState(initEndDate)
  const [quickSelect, setQuickSelect] = useState('')

  const predefinedRanges = [
    {
      label: 'Last Month',
      range: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')],
    },
    {
      label: 'Last Year',
      range: [dayjs().subtract(1, 'year').startOf('year'), dayjs().subtract(1, 'year').endOf('year')],
    },
    { label: 'This Month', range: [dayjs().startOf('month'), dayjs().endOf('month')] },
  ]

  const applyQuickSelect = (option) => {
    setStartDate(option?.range?.[0])
    setEndDate(option?.range?.[1])
    setQuickSelect(option?.label)
    setShowPicker(false)
    onApply && onApply(option?.range)
  }

  const handleDateChange = (e, type) => {
    const date = dayjs(e.target.value, 'YYYY-MM-DD', true)
    if (date.isValid()) {
      if (type === 'start') {
        setStartDate(date)
        if (dayjs(date)?.isAfter(dayjs(endDate))) setEndDate(date)
      } else {
        setEndDate(date)
        if (dayjs(date)?.isBefore(dayjs(startDate))) setStartDate(date)
      }
      setQuickSelect('')
    }
  }

  const clearDates = () => {
    setStartDate(null)
    setEndDate(null)
    setQuickSelect('')
    setShowPicker(false)
    onApply && onApply(null)
  }

  return (
    <div className="relative">
      {/* Compact Display */}
      <button
        className="w-full border border-gray-400 mb-1 h-8 text-xs hover:bg-gray-100"
        onClick={() => setShowPicker(!showPicker)}
      >
        {quickSelect
          ? quickSelect
          : startDate && endDate
          ? `${startDate.format(dateDMY)}-${endDate.format(dateDMY)}`
          : 'All Dates'}
      </button>

      {/* Date Picker Popup */}
      {showPicker && (
        <div className="absolute top-full mt-2 p-4 bg-white shadow-lg rounded z-50 w-72">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPicker(false)}
            aria-label="Close"
          >
            ✕
          </button>
          <div className="flex justify-between items-center space-x-2">
            <div>
              <label className="text-xs font-bold">Start Date</label>
              <input
                type="date"
                value={startDate?.format('YYYY-MM-DD')}
                onChange={(e) => handleDateChange(e, 'start')}
                className="border rounded w-full p-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold">End Date</label>
              <input
                type="date"
                value={endDate?.format('YYYY-MM-DD')}
                onChange={(e) => handleDateChange(e, 'end')}
                className="border rounded w-full p-1 text-sm"
              />
            </div>
          </div>

          {/* Clear Button */}
          <button onClick={clearDates} className="mt-2 text-xs text-red-500 hover:underline">
            Clear Dates
          </button>

          {/* Predefined Quick Select Options */}
          <div className="mt-4">
            <p className="text-xs font-bold">Quick Select:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {predefinedRanges.map((option) => (
                <button
                  key={option.label}
                  onClick={() => applyQuickSelect(option)}
                  className="text-xs px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <button
            className="mt-4 w-full bg-blue-500 text-white text-xs font-bold py-1 rounded hover:bg-blue-600"
            onClick={() => {
              setShowPicker(false)
              onApply && onApply([startDate, endDate])
            }}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}

export default CompactDateRangePicker
