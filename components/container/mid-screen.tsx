import BackButton from 'components/button/back-button'
import DropdownMenu from 'components/dropdown-menu'

export default function MidScreenContainer({
  children,
  title,
  titleClass = '',
  isLoading = false,
  actionButtons = <div />,
  full = false,
  dark = false,
  showBackButton = false,
  menuItems = null,
}) {
  return (
    <div className={`h-main w-full ${full ? '' : 'sm:w-boardMainSmall lg:w-boardMain'}`}>
      {title && (
        <div
          className={`${titleClass} text-2xl font-bold uppercase p-2 flex justify-between items-center border-b h-header`}
        >
          <div className="flex items-center">
            {showBackButton && <BackButton dark={dark} />}
            {title}
          </div>
          {actionButtons}
          {menuItems ? <DropdownMenu items={menuItems} dark={dark} /> : <div />}
        </div>
      )}
      {isLoading ? (
        <div className="loading-screen">
          <div className="loading-icon" />
        </div>
      ) : (
        <div className="h-content overflow-y-scroll">{children}</div>
      )}
    </div>
  )
}
