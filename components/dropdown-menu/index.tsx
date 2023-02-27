import React from 'react'

const DropdownMenu = ({ open, setOpen, items }) => {
  return (
    <div className="relative">
      <div
        className={`absolute top-7 right-7 bg-white shadow-2xl z-50 border transition-height duration-500 ${
          open ? '' : 'hidden'
        }`}
      >
        {items?.map((item, i) => (
          <div key={i} className="block text-gray-700 hover:bg-blue-500 hover:text-white p-2">
            <button
              className="flex flex-nowrap w-dropdown"
              onClick={() => {
                setOpen(false)
                item?.onClick()
              }}
            >
              <div className="mr-2">{item?.icon}</div>
              {item?.text}
            </button>
          </div>
        ))}
      </div>
      {/* {open && <div className={`w-screen h-screen absolute bg-green-500 opacity-40 z-10`} onClick={setOpen(false)} />} */}
    </div>
  )
}

export default DropdownMenu
