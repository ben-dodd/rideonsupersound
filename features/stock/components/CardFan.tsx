import React from 'react'
import { OverlappedCard } from './FannedCard'

interface HorizontalCardScrollProps {
  items: any[]
  showPrice?: boolean
}

export const HorizontalCardScroll: React.FC<HorizontalCardScrollProps> = ({ items, showPrice = false }) => {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 px-4 min-w-max">
        {items.map((item) => (
          <OverlappedCard key={item.id} item={item} showPrice={showPrice} />
        ))}
      </div>
    </div>
  )
}
