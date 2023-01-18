import { ArrowCircleLeftRounded } from '@mui/icons-material'
import { useRouter } from 'next/router'

export default function MidScreenContainer({
  children,
  title,
  titleClass = '',
  isLoading = false,
  actionButtons = <div />,
}) {
  const router = useRouter()
  const handleBackClick = () => router.back()
  return (
    <div className="mid-screen">
      {title && (
        <div
          className={`${titleClass} text-2xl font-bold uppercase p-2 mb-1 flex justify-between items-center border-b bg-white h-header`}
        >
          <div className="flex items-center">
            <button className="hover:text-blue-500 px-2" onClick={handleBackClick}>
              <ArrowCircleLeftRounded />
            </button>
            {title}
          </div>
          {actionButtons}
        </div>
      )}
      {isLoading ? (
        <div className="loading-screen">
          <div className="loading-icon" />
        </div>
      ) : (
        children
      )}
    </div>
  )
}
