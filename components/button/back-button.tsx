import { ArrowCircleLeftOutlined } from '@mui/icons-material'
import { useRouter } from 'next/router'
import React, { MouseEventHandler } from 'react'

const BackButton = ({
  handleBackClick,
  dark = false,
}: {
  handleBackClick?: MouseEventHandler<HTMLButtonElement>
  dark: boolean
}) => {
  const router = useRouter()
  const handleClick = handleBackClick ? handleBackClick : () => router.back()
  return (
    <button className={`${dark ? 'hover:text-yellow-200' : 'hover:text-gray-600'} px-2`} onClick={handleClick}>
      <ArrowCircleLeftOutlined />
    </button>
  )
}

export default BackButton
