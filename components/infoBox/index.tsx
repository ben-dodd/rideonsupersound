import React from 'react'
import { CheckCircle, Cancel, LinkOutlined } from '@mui/icons-material'
import { useRouter } from 'next/router'

const InfoBox = ({ title, image, data }: { title?: string; image?: string; data: any }) => {
  const router = useRouter()
  return (
    <div className="bg-gray-100 text-brown rounded p-2 my-2 border-2 border-brown max-w-md">
      {title && <div className="text-xl text-black mt-2 mb-4">{title}</div>}
      {image && (
        <div className="flex justify-center">
          <div className="w-52 h-52 aspect-ratio-square">
            <img className="h-full w-full object-cover" src={image} alt={'Info Box Image'} />
          </div>
        </div>
      )}
      {data?.map((row) =>
        row?.value ? (
          <div className="flex py-1" key={row?.label}>
            <div className="flex">
              <div className="font-bold mr-2 text-brown-dark">{row?.label}</div>
              <div>{typeof row?.value == 'boolean' ? row?.value ? <CheckCircle /> : <Cancel /> : row?.value}</div>
            </div>
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
