import { Settings } from '@mui/icons-material'
import BackButton from 'components/button/back-button'
import DropdownMenu from 'components/dropdown-menu'
import { useState } from 'react'

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
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible((isVisible) => !isVisible)
  return (
    <div className={`h-main w-full ${full ? '' : 'sm:w-boardMainSmall lg:w-boardMain'}`}>
      {title && (
        <div
          className={`${titleClass} text-2xl font-bold uppercase p-2 flex justify-between items-center border-b bg-white h-header`}
        >
          <div className="flex items-center">
            {showBackButton && <BackButton dark={dark} />}
            {title}
          </div>
          {actionButtons}
          {menuItems ? (
            <>
              <DropdownMenu items={menuItems} open={menuVisible} setOpen={setMenuVisible} />
              <button
                onClick={toggleMenu}
                className={`${dark ? 'hover:text-yellow-200 ' : 'hover:text-gray-600 '}${
                  menuVisible ? (dark ? 'text-yellow-200' : 'text-gray-600') : ''
                }`}
              >
                <Settings />
              </button>
            </>
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
        children
      )}
    </div>
  )
}
