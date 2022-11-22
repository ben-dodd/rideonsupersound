// Packages
import { saveSystemLog } from 'features/log/lib/functions'
import { clerkAtom, pageAtom, viewAtom } from 'lib/atoms'
import { bg } from 'lib/types'
import InventoryIcon from '@mui/icons-material/Category'
import LaybyIcon from '@mui/icons-material/DryCleaning'
import LogoutIcon from '@mui/icons-material/ExitToApp'
import LogsIcon from '@mui/icons-material/GridOn'
import SellIcon from '@mui/icons-material/LocalAtm'
import SalesIcon from '@mui/icons-material/MonetizationOn'
import StocktakeIcon from '@mui/icons-material/Numbers'
import HoldsIcon from '@mui/icons-material/PanTool'
import PaymentsIcon from '@mui/icons-material/Receipt'
import GiftCardsIcon from '@mui/icons-material/Redeem'
import VendorsIcon from '@mui/icons-material/Store'
import JobsIcon from '@mui/icons-material/Task'
import { useAtom } from 'jotai'
import MenuItem from './menu-item'
import PyramidImage from './pyramid-image'

type MenuType = {
  type: string
  page: string
  text: string
  badge: any
  class: string
  icon: any
  onClick: any
}

export default function Menu({ badges }) {
  const [page, setPage] = useAtom(pageAtom)
  const [view, setView] = useAtom(viewAtom)
  const [clerk, setClerk] = useAtom(clerkAtom)

  const topMenu = [
    {
      type: 'link',
      page: 'sell',
      text: 'SELL',
      badge: badges.numCartItems,
      class: 'bg-col1-light hover:bg-col1',
      icon: <SellIcon />,
    },
    {
      type: 'link',
      page: 'inventory',
      text: 'INVENTORY',
      class: 'bg-col2-light hover:bg-col2',
      icon: <InventoryIcon />,
    },
    {
      type: 'link',
      page: 'vendors',
      text: 'VENDORS',
      class: 'bg-col3-light hover:bg-col3',
      icon: <VendorsIcon />,
    },
    {
      type: 'link',
      page: 'payments',
      text: 'PAYMENTS',
      class: 'bg-col4-light hover:bg-col4',
      icon: <PaymentsIcon />,
    },
    {
      type: 'link',
      page: 'sales',
      text: 'SALES',
      class: 'bg-col5-light hover:bg-col5',
      icon: <SalesIcon />,
    },
    {
      type: 'link',
      page: 'laybys',
      text: 'LAYBYS',
      class: 'bg-col6-light hover:bg-col6',
      icon: <LaybyIcon />,
    },
    {
      type: 'link',
      page: 'holds',
      text: 'HOLDS',
      class: 'bg-col7-light hover:bg-col7',
      icon: <HoldsIcon />,
    },
    {
      type: 'link',
      page: 'giftCards',
      text: 'GIFT CARDS',
      class: 'bg-col8-light hover:bg-col8',
      icon: <GiftCardsIcon />,
    },
  ]
  const bottomMenu = [
    {
      type: 'link',
      page: 'logs',
      text: 'LOGS',
      class: 'bg-col9-light hover:bg-col9',
      icon: <LogsIcon />,
    },
    {
      type: 'link',
      page: 'jobs',
      text: 'JOBS',
      badge: badges.numJobsToDo,
      class: 'bg-col10-light hover:bg-col10',
      icon: <JobsIcon />,
    },
    {
      type: 'link',
      page: 'stocktake',
      text: 'STOCKTAKE',
      class: 'bg-col1-light hover:bg-col1',
      icon: <StocktakeIcon />,
    },
    {
      type: 'link',
      page: '/api/auth/logout',
      onClick: () => setClerk(null),
      text: 'SWITCH CLERK',
      class: 'bg-col2-light hover:bg-col2',
      icon: <LogoutIcon />,
    },
  ]

  const defaultOnClick = (item) => {
    window.scrollTo(0, 0)
    saveSystemLog(`${item?.page} on menu clicked.`, clerk?.id)
    setPage(item?.page)
    setView({ ...view, mainMenu: false })
  }

  return (
    <div
      className={`w-0 overflow-y-auto flex flex-col h-menu justify-between ${
        bg[clerk?.colour]
      } z-50 flex-shrink-0 whitespace-pre relative ${
        view?.mainMenu && 'w-full '
      }sm:w-full sm:w-icons sm:border-r lg:w-menu transition-width duration-200 `}
    >
      <ul>
        {topMenu?.map((item: MenuType, i: number) => (
          <MenuItem
            key={i}
            item={item}
            page={page}
            defaultOnClick={defaultOnClick}
          />
        ))}
      </ul>
      <PyramidImage />
      <ul>
        {bottomMenu?.map((item: MenuType, i: number) => (
          <MenuItem
            key={i}
            item={item}
            page={page}
            defaultOnClick={defaultOnClick}
          />
        ))}
      </ul>
    </div>
  )
}

// {
//   type: "link",
//   page: "orders",
//   text: "ORDERS",
//   color: "col5",
//   icon: <OrdersIcon />,
// },
// {
//   type: "link",
//   page: "suppliers",
//   text: "SUPPLIERS",
//   color: "col7",
//   icon: <SuppliersIcon />,
// },
// {
//   type: "link",
//   page: "staff",
//   text: "STAFF",
//   class: "bg-col6-light hover:bg-col6",
//   icon: <StaffIcon />,
// },
// { type: "divider" },
// {
//   type: "link",
//   page: "stats",
//   text: "STATS",
//   class: "bg-col1-light hover:bg-col1",
//   icon: <StatsIcon />,
// },
// {
//   type: "link",
//   page: "settings",
//   text: "SETTINGS",
//   color: "col2",
//   icon: <SettingsIcon />,
// },
