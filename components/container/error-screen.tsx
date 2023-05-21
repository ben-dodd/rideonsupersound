import { ErrorOutlineOutlined } from '@mui/icons-material'
import { useRouter } from 'next/router'

const ErrorScreen = ({ message, redirectUrl = null }) => {
  const router = useRouter()
  return (
    <div className="w-full h-full flex justify-center items-center bg-red-500">
      <div className="text-center p-4 shadow-md bg-white rounded-md">
        <ErrorOutlineOutlined style={{ fontSize: '60px' }} className="pb-4 text-red-600" />
        <div className="text-2xl text-brown">{message}</div>
        <div className="pt-4 text-2xl">
          <button onClick={() => (redirectUrl ? router.push(redirectUrl) : router.back())} className="link-red">
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorScreen
