import { useRouter } from 'next/router'

export default function MenuItem({ item, defaultOnClick }) {
  const router = useRouter()
  const handleOnClick = item?.onClick
    ? item?.onClick
    : () => defaultOnClick(item)
  return item?.type === 'divider' ? (
    <hr />
  ) : (
    <li
      className={`flex cursor-pointer content-center p-2 py-3 ${
        router.pathname === item?.page
          ? 'text-white hover:bg-black bg-black'
          : item?.class || ''
      }`}
      onClick={handleOnClick}
    >
      <div className="flex">
        <div className="pr-6">
          {item?.badge ? (
            <div className="relative">
              {item?.icon}
              <div className="flex justify-center items-center absolute -top-1 -right-2 h-5 w-5 bg-green-400 text-white text-xs rounded-full">
                {item?.badge}
              </div>
            </div>
          ) : (
            item?.icon
          )}
        </div>
        <div>{item?.text}</div>
      </div>
    </li>
  )
}
