const ErrorScreen = ({ message }) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="text-4xl">{message}</div>
    </div>
  )
}

export default ErrorScreen
