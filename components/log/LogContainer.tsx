import React, { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { LogGroup } from './LogGroup'
import { LogEntryProps } from './LogEntry'

export interface LogContainerProps {
  entries: LogEntryProps[]
  title?: string
  showSearch?: boolean
  onSearch?: (query: string) => void
  searchValue?: string
  showFilters?: boolean
}

export const LogContainer: React.FC<LogContainerProps> = ({
  entries,
  title,
  showSearch = false,
  onSearch,
  searchValue = '',
  showFilters = false,
}) => {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedClerk, setSelectedClerk] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  // Get unique clerks and types for filter options
  const clerks = useMemo(() => {
    const uniqueClerks = Array.from(new Set(entries.map((entry) => entry.actor)))
    return uniqueClerks.filter((clerk) => clerk && clerk !== 'Unknown')
  }, [entries])

  const types = useMemo(() => {
    const uniqueTypes = Array.from(new Set(entries.map((entry) => entry.type)))
    return uniqueTypes
  }, [entries])

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Date range filter
      if (dateFrom || dateTo) {
        const entryDate = dayjs(entry.time, 'h:mm A')
        if (dateFrom && entryDate.isBefore(dayjs(dateFrom))) return false
        if (dateTo && entryDate.isAfter(dayjs(dateTo))) return false
      }

      // Clerk filter
      if (selectedClerk && entry.actor !== selectedClerk) return false

      // Type filter
      if (selectedType && entry.type !== selectedType) return false

      return true
    })
  }, [entries, dateFrom, dateTo, selectedClerk, selectedType])

  const groupedEntries = useMemo(() => {
    const groups: { [key: string]: LogEntryProps[] } = {}

    filteredEntries.forEach((entry) => {
      // Parse the time to get date
      const entryDate = dayjs(entry.time, 'h:mm A').format('YYYY-MM-DD')
      const today = dayjs().format('YYYY-MM-DD')
      const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

      let dateLabel = dayjs(entryDate).format('MMMM D, YYYY')

      if (entryDate === today) {
        dateLabel = 'Today'
      } else if (entryDate === yesterday) {
        dateLabel = 'Yesterday'
      } else if (dayjs(entryDate).isAfter(dayjs().subtract(7, 'days'))) {
        dateLabel = dayjs(entryDate).format('dddd') // Day name for this week
      }

      if (!groups[dateLabel]) {
        groups[dateLabel] = []
      }

      groups[dateLabel].push(entry)
    })

    // Sort groups by date (most recent first)
    const sortedGroups = Object.keys(groups)
      .sort((a, b) => {
        if (a === 'Today') return -1
        if (b === 'Today') return 1
        if (a === 'Yesterday') return -1
        if (b === 'Yesterday') return 1

        // For other dates, sort by actual date
        return dayjs(b, 'MMMM D, YYYY').valueOf() - dayjs(a, 'MMMM D, YYYY').valueOf()
      })
      .map((dateLabel) => ({
        date: dateLabel,
        entries: groups[dateLabel].sort((a, b) => {
          // Sort entries within each group by time (most recent first)
          return dayjs(b.time, 'h:mm A').valueOf() - dayjs(a.time, 'h:mm A').valueOf()
        }),
      }))

    return sortedGroups
  }, [filteredEntries])

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      {title && (
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-20">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            {showFilters && (
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            )}
          </div>

          {/* Search */}
          {showSearch && onSearch && (
            <div className="mt-3">
              <input
                type="text"
                placeholder="Search logs..."
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Advanced Filters */}
          {showFilters && showAdvancedFilters && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clerk</label>
                <select
                  value={selectedClerk}
                  onChange={(e) => setSelectedClerk(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Clerks</option>
                  {clerks.map((clerk) => (
                    <option key={clerk} value={clerk}>
                      {clerk}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Movement Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Log groups */}
      <div className="p-4">
        {groupedEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {filteredEntries.length === 0 && entries.length > 0
              ? 'No entries match your filters'
              : 'No log entries found'}
          </div>
        ) : (
          groupedEntries.map((group) => <LogGroup key={group.date} date={group.date} entries={group.entries} />)
        )}
      </div>
    </div>
  )
}
