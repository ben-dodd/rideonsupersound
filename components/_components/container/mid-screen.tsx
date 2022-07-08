export default function MidScreenContainer({
  children,
  title,
  titleClass,
  isLoading,
  actionButtons,
}) {
  return (
    <div className="w-full sm:w-2/3 bg-gray-100">
      {title && (
        <div
          className={`${titleClass} text-4xl font-bold uppercase text-white p-2 mb-1 flex justify-between`}
        >
          <div>{title}</div>
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
