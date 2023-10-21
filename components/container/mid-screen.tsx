import BackButton from 'components/button/back-button'
import DropdownMenu from 'components/dropdown-menu'
import { useMe } from 'lib/api/clerk'
import { isUserAdmin } from 'lib/functions/user'

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
  const adminOnlyMenu = menuItems?.filter((menuItem) => !menuItem?.adminOnly)?.length === 0
  const adminOnlyMenuTest = false
  const { me } = useMe()
  const isAdmin = isUserAdmin(me)
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
          {menuItems && (!adminOnlyMenuTest || adminOnlyMenu || isAdmin) ? (
            <DropdownMenu items={menuItems} dark={dark} />
          ) : (
            <div />
          )}
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
