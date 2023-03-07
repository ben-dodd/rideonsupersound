import React from 'react'
import { CheckCircle, Cancel, LinkOutlined } from '@mui/icons-material'
import { useRouter } from 'next/router'

const InfoBox = ({ title, image, data }: { title?: string; image?: string; data: any }) => {
  const router = useRouter()
  return (
    <div className="bg-white text-brown rounded p-2 my-2 border max-w-md">
      {title && <div className="text-xl text-black mt-2 mb-4">{title}</div>}
      {image && (
        <div className="flex">
          <div className="w-52 h-52 aspect-ratio-square">
            <img className="h-full w-full object-cover" src={image} alt={'Info Box Image'} />
          </div>
        </div>
      )}
      {data?.map((row) =>
        typeof row?.value === 'boolean' ? (
          <div className="flex py-1 text-sm items-center" key={row?.label}>
            <div className="mr-2 text-brown-dark">{row?.label}</div>
            {row?.value ? (
              <CheckCircle style={{ fontSize: '20px' }} className="text-green-500" />
            ) : (
              <Cancel style={{ fontSize: '20px' }} className="text-red-500" />
            )}
          </div>
        ) : row?.value ? (
          <div className="flex py-1" key={row?.label}>
            <div className="font-bold mr-2 text-brown-dark">{row?.label}</div>
            <div>{row?.value}</div>
            {row?.link ? (
              <button className="ml-2 link-blue" onClick={() => router.push(row?.link)}>
                <LinkOutlined />
              </button>
            ) : (
              <div />
            )}
          </div>
        ) : (
          <div key={row?.label} />
        ),
      )}
    </div>
  )
}

export default InfoBox
