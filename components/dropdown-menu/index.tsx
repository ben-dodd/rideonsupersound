import { Settings } from '@mui/icons-material'
import { useState } from 'react'

const DropdownMenu = ({ items, dark }) => {
  const [menuVisible, setMenuVisible] = useState(false)
  const toggleMenu = () => setMenuVisible((isVisible) => !isVisible)
  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className={`${dark ? 'hover:text-yellow-200 ' : 'hover:text-gray-600 '}${
          menuVisible ? (dark ? 'text-yellow-200' : 'text-gray-600') : ''
        }`}
      >
        <Settings />
      </button>
      <div
        className={`absolute bg-white top-6 right-6 text-sm opacity-80 shadow-lg z-50 border transition-height duration-500 ${
          menuVisible ? '' : 'hidden'
        }`}
      >
        {items?.map((item, i) => (
          <div key={i} className="block text-gray-700 hover:bg-blue-500 hover:text-white p-2">
            <button
              className="flex flex-nowrap w-dropdown"
              onClick={() => {
                setMenuVisible(false)
                item?.onClick?.()
              }}
            >
              <div className="mr-2">{item?.icon}</div>
              {item?.text}
            </button>
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
