import React from 'react'
import { CheckCircle, Cancel, LinkOutlined } from '@mui/icons-material'
import { useRouter } from 'next/router'

interface infoOption {
  label?: string
  value?: any
  link?: string
  alwaysDisplay?: boolean
  isHorizontalRule?: boolean
}

const InfoBox = ({ title, image, data }: { title?: string; image?: string; data: infoOption[] }) => {
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
        row?.isHorizontalRule ? (
          <div className="border-b py-1" />
        ) : typeof row?.value === 'boolean' ? (
          row?.value || row?.alwaysDisplay ? (
            <div className={`flex py-1 text-sm items-center`} key={row?.label}>
              <div className="mr-2 text-brown-dark">{row?.label}</div>
              {row?.value ? (
                <CheckCircle style={{ fontSize: '20px' }} className="text-green-500" />
              ) : (
                <Cancel style={{ fontSize: '20px' }} className="text-red-500" />
              )}
            </div>
          ) : (
            <div key={row?.label} />
          )
        ) : row?.value || row?.alwaysDisplay ? (
          <div className={`flex py-1`} key={row?.label}>
            <div className="font-bold mr-2 text-brown-dark">{row?.label}</div>
            <div>{row?.value || 'N/A'}</div>
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