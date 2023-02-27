import React from 'react'
import { CheckCircle, Cancel, LinkOutlined } from '@mui/icons-material'
import { useRouter } from 'next/router'

const InfoBox = ({ image, data }) => {
  const router = useRouter()
  return (
    <div className="bg-brown text-white rounded-lg p-2">
      {image && (
        <div className="flex justify-center">
          <div className="w-52 h-52 aspect-ratio-square">
            <img className="h-full w-full object-cover" src={image} alt={'Info Box Image'} />
          </div>
        </div>
      )}
      {data?.map((row) =>
        row?.value ? (
          <div className="flex border-b py-2" key={row?.label}>
            <div className="flex">
              <div className="font-bold mr-2 text-red-200">{row?.label?.toUpperCase()}</div>
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
