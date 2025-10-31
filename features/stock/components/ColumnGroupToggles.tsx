import React from 'react'
import { Check } from '@mui/icons-material'

interface ColumnGroupTogglesProps {
  visibleGroups: {
    essential: boolean
    details: boolean
    prices: boolean
    quantities: boolean
    history: boolean
  }
  onToggle: (group: string) => void
}

export const ColumnGroupToggles: React.FC<ColumnGroupTogglesProps> = ({ visibleGroups, onToggle }) => {
  const groups = [
    {
      key: 'details',
      label: 'Details',
      activeColor: 'bg-blue-500 hover:bg-blue-600 text-white',
      inactiveColor: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
    },
    {
      key: 'prices',
      label: 'Prices',
      activeColor: 'bg-green-500 hover:bg-green-600 text-white',
      inactiveColor: 'bg-green-100 hover:bg-green-200 text-green-700',
    },
    {
      key: 'quantities',
      label: 'Quantities',
      activeColor: 'bg-purple-500 hover:bg-purple-600 text-white',
      inactiveColor: 'bg-purple-100 hover:bg-purple-200 text-purple-700',
    },
    {
      key: 'history',
      label: 'History',
      activeColor: 'bg-amber-500 hover:bg-amber-600 text-white',
      inactiveColor: 'bg-amber-100 hover:bg-amber-200 text-amber-700',
    },
  ]

  return (
    <div className="flex gap-2 mb-3 p-2 bg-gray-50 rounded">
      {groups.map((group) => (
        <button
          key={group.key}
          type="button"
          onClick={() => onToggle(group.key)}
          className={`
            px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-1
            ${visibleGroups[group.key] ? group.activeColor : group.inactiveColor}
          `}
          aria-label={`${visibleGroups[group.key] ? 'Hide' : 'Show'} ${group.label} columns`}
          aria-pressed={visibleGroups[group.key]}
        >
          {visibleGroups[group.key] && <Check fontSize="small" />}
          {group.label}
        </button>
      ))}
    </div>
  )
}
