import BackButton from 'components/button/back-button'

export default function MidScreenContainer({
  children,
  title,
  titleClass = '',
  isLoading = false,
  actionButtons = <div />,
  full = false,
  showBackButton = false,
}) {
  return (
    <div className={`h-main w-full ${full ? '' : 'sm:w-boardMainSmall lg:w-boardMain'}`}>
      {title && (
        <div
          className={`${titleClass} text-2xl font-bold uppercase p-2 flex justify-between items-center border-b bg-white h-header`}
        >
          <div className="flex items-center">
            {showBackButton && <BackButton />}
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
