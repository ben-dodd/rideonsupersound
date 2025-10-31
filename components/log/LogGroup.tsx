import React from 'react'
import { LogEntry, LogEntryProps } from './LogEntry'

export interface LogGroupProps {
  date: string
  entries: LogEntryProps[]
}

export const LogGroup: React.FC<LogGroupProps> = ({ date, entries }) => {
  return (
    <div className="mb-8">
      {/* Date header */}
      <div className="sticky top-0 bg-white border-b-2 border-gray-200 py-3 mb-4 z-10">
        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">{date}</h3>
      </div>

      {/* Log entries */}
      <div className="space-y-1">
        {entries.map((entry, index) => (
          <LogEntry key={`${entry.time}_${entry.item.id}_${index}`} {...entry} />
        ))}
      </div>
    </div>
  )
}
