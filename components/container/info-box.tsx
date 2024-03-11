import { CheckCircle, Cancel } from '@mui/icons-material'
import { Image } from 'components/image'
import { UploadableImage } from 'components/image/uploadable'
import { useRouter } from 'next/router'
import { MouseEventHandler } from 'react'

interface infoOption {
  label?: string
  value?: any
  link?: string
  icon?: any
  alwaysDisplay?: boolean
  isHorizontalRule?: boolean
}

const InfoBox = ({
  title,
  image,
  data,
  imageIsClickable,
  onImageUpload,
}: {
  title?: string
  image?: string
  data: infoOption[]
  imageIsClickable?: boolean
  onImageUpload?: MouseEventHandler
}) => {
  const router = useRouter()
  return (
    <div className="bg-white text-brown rounded p-2 my-2 border max-w-md">
      {title && <div className="text-xl text-black mt-2 mb-4">{title}</div>}
      {image && (
        <div className="flex">
          <div className="w-52 h-52 aspect-ratio-square">
            {imageIsClickable ? (
              <UploadableImage imageUrl={image} onImageUpload={onImageUpload} />
            ) : (
              <Image imageUrl={image} />
            )}
          </div>
        </div>
      )}
      {data?.map((row, i) =>
        row?.isHorizontalRule ? (
          <div key={i} className="border-b py-1" />
        ) : typeof row?.value === 'boolean' ? (
          row?.value || row?.alwaysDisplay ? (
            <div className={`flex py-1 text-sm items-center`} key={i}>
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
          <div className={`flex py-1 flex-wrap`} key={row?.label}>
            <div className={`font-bold mr-2 text-brown-dark`}>{row?.label}</div>
            <div
              className={`${row?.link ? ' link-blue' : ''}`}
              onClick={row?.link ? () => router.push(row?.link) : null}
            >
              {row?.value || 'N/A'}
            </div>
            {row?.icon && row?.icon}
          </div>
        ) : (
          <div key={row?.label} />
        ),
      )}
    </div>
  )
}

export default InfoBox
