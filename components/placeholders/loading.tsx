const Loading = ({
  size = 'md',
  type = 'pulse',
}: {
  size?: 'full' | 'md' | 'sm'
  type?: 'pulse' | 'dots' | 'bars'
}) => {
  return (
    <div
      className={`flex justify-center items-center ${
        size === 'full' ? 'h-screen w-screen' : size === 'md' ? 'h-full w-full' : 'h-full w-full'
      }`}
    >
      {type === 'dots' ? (
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      ) : type === 'bars' ? (
        <div className="flex gap-1 items-end h-8">
          <div className="w-2 bg-gray-400 rounded animate-pulse" style={{ height: '60%', animationDelay: '0ms' }} />
          <div className="w-2 bg-gray-400 rounded animate-pulse" style={{ height: '100%', animationDelay: '150ms' }} />
          <div className="w-2 bg-gray-400 rounded animate-pulse" style={{ height: '80%', animationDelay: '300ms' }} />
          <div className="w-2 bg-gray-400 rounded animate-pulse" style={{ height: '60%', animationDelay: '450ms' }} />
        </div>
      ) : (
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
          <div
            className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"
            style={{ animationDuration: '1.5s' }}
          />
        </div>
      )}
    </div>
  )
}

export default Loading
