import { Settings } from '@mui/icons-material'
import { useMe } from 'lib/api/clerk'
import { isUserAdmin } from 'lib/functions/user'
import { useState } from 'react'
import { CSVLink } from 'react-csv'

const DropdownMenu = ({
  items,
  dark = false,
  icon,
  buttonClass,
  customMenu,
}: {
  items?: any[]
  dark?: boolean
  icon?: any
  buttonClass?: string
  customMenu?: any
}) => {
  const [menuVisible, setMenuVisible] = useState(false)
  const { me } = useMe()
  const isAdmin = isUserAdmin(me)
  const toggleMenu = () => setMenuVisible((isVisible) => !isVisible)
  return (
    <div className="flex items-center relative h-full">
      <button
        onClick={toggleMenu}
        className={
          buttonClass ||
          `${dark ? 'hover:text-yellow-200 ' : 'hover:text-gray-600 '}${
            menuVisible ? (dark ? 'text-yellow-200' : 'text-gray-600') : ''
          }`
        }
      >
        {icon || <Settings />}
      </button>
      <div
        className={`absolute bg-white top-6 right-6 text-sm opacity-90 shadow-lg z-50 border transition-height duration-500 ${
          menuVisible ? '' : 'hidden'
        }`}
      >
        {customMenu
          ? customMenu
          : items
              // ?.filter((item) => !item?.adminOnly || isAdmin)
              ?.map((item, i) => (
                <div
                  key={i}
                  className={`block text-gray-700 ${
                    item?.disabled || (item?.adminOnly && !isAdmin)
                      ? 'cursor-default text-gray-300'
                      : 'hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  {item?.data && !item?.isDisabled ? (
                    <CSVLink
                      className={`flex items-center justify-start flex-nowrap w-dropdown p-2 normal-case`}
                      data={item?.data}
                      headers={item?.headers}
                      filename={item?.fileName}
                      onClick={() => {
                        setMenuVisible(false)
                        item?.onClick?.()
                      }}
                    >
                      <div className="mr-2 text-left">{item?.icon}</div>
                      <div className="text-left line-clamp-3">{item?.text}</div>
                    </CSVLink>
                  ) : (
                    <button
                      className={`flex items-center justify-start flex-nowrap w-dropdown p-2`}
                      onClick={() => {
                        setMenuVisible(false)
                        item?.onClick?.()
                      }}
                    >
                      <div className="mr-2 text-left">{item?.icon}</div>
                      <div className="text-left line-clamp-3">{item?.text}</div>
                    </button>
                  )}
                </div>
              ))}
      </div>
      {menuVisible && (
        <div className={`fixed top-0 left-0 w-screen h-screen z-40`} onClick={() => setMenuVisible(false)} />
      )}
    </div>
  )
}

export default DropdownMenu
