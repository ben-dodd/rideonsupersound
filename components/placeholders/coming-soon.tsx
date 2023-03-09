import React from 'react'
import Image from 'next/image'

const ComingSoon = ({ message = 'Coming Soon...' }: { message?: string }) => {
  return (
    <div
      className={`flex h-full w-full items-center justify-center
      `}
    >
      <div>
        <Image
          className="m-auto inline-block"
          src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/reaper.png`}
          alt="Loading"
          width={200}
          height={200}
        />
        <div className="text-4xl text-col4-dark mt-2 font-creep">{message}</div>
      </div>
    </div>
  )
}

export default ComingSoon
