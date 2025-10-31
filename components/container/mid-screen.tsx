import { useEffect } from 'react'
import BackButton from 'components/button/back-button'
import Loading from 'components/placeholders/loading'
import { useMe } from 'lib/api/clerk'
import { isUserAdmin } from 'lib/functions/user'
import { usePageHeader } from 'components/layout/PageHeaderContext'

export default function MidScreenContainer({
  children,
  title = '', // Deprecated - title now in UnifiedHeader
  titleClass = '', // Deprecated
  isLoading = false,
  actionButtons = null,
  full = true, // Now defaults to full width
  dark = false, // Deprecated
  showBackButton = false,
  menuItems = null,
}: {
  children: any
  title?: string
  titleClass?: string
  isLoading?: boolean
  actionButtons?: any
  full?: boolean
  dark?: boolean
  showBackButton?: boolean
  menuItems?: any
}) {
  const { setMenuItems, setActionButtons } = usePageHeader()
  const adminOnlyMenu = menuItems?.filter((menuItem) => !menuItem?.adminOnly)?.length === 0
  const adminOnlyMenuTest = false
  const { me } = useMe()
  const isAdmin = isUserAdmin(me)

  // Set menu items and action buttons in header context
  useEffect(() => {
    const finalMenuItems = menuItems && (!adminOnlyMenuTest || adminOnlyMenu || isAdmin) ? menuItems : null
    const finalActionButtons = showBackButton ? <BackButton /> : actionButtons

    setMenuItems(finalMenuItems)
    setActionButtons(finalActionButtons)

    // Cleanup on unmount
    return () => {
      setMenuItems(null)
      setActionButtons(null)
    }
  }, [
    menuItems,
    actionButtons,
    showBackButton,
    adminOnlyMenu,
    adminOnlyMenuTest,
    isAdmin,
    setMenuItems,
    setActionButtons,
  ])

  return (
    <div className={`h-full w-full ${full ? '' : 'max-w-7xl mx-auto'}`}>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loading />
        </div>
      ) : (
        <div className="h-full overflow-hidden">{children}</div>
      )}
    </div>
  )
}
