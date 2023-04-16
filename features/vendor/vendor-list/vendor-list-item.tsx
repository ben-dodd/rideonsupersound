import { Album, Interests, LocalShipping, Lyrics, MenuBook, Mood, Person, Voicemail } from '@mui/icons-material'
import { VendorObject } from 'lib/types/vendor'
import { useRouter } from 'next/router'
import React from 'react'

const VendorListItem = ({ vendor }: { vendor: VendorObject }) => {
  const router = useRouter()
  let categoryIcon = <Person />
  switch (vendor?.vendorCategory) {
    case 'BAND':
      // categoryIcon = <InterpreterMode className="text-blue-300" />
      categoryIcon = <Lyrics className="text-blue-300" />
      break
    case 'ZINE/COMIC':
      categoryIcon = <MenuBook className="text-yellow-400" />
      break
    case 'ZINE':
      categoryIcon = <MenuBook className="text-yellow-400" />
      break
    case 'COMEDIAN':
      categoryIcon = <Mood className="text-purple-300" />
      break
    case 'TAPES':
      categoryIcon = <Voicemail className="text-green-600" />
      break
    case 'MERCH':
      categoryIcon = <Interests className="text-red-500" />
      break
    case 'DISTRO':
      categoryIcon = <LocalShipping className="text-yellow-800" />
      break
    case 'USED':
      categoryIcon = <Album className="text-green-300" />
      break
  }
  return (
    <div className={`list-item-compact`} onClick={() => router.push(`/vendors/${vendor?.id}`)}>
      <div className="flex">
        <div className="w-12">{categoryIcon}</div>
        {`[${`000${vendor?.id}`.slice(-3)}] ${vendor?.name}`}
      </div>
      <div />
    </div>
  )
}

export default VendorListItem
