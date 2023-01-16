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
import MenuItem from './menu-item'
import PyramidImage from './pyramid-image'
import { useRouter } from 'next/router'
import { useAppStore } from 'lib/store'
import { useClerk } from 'lib/api/clerk'
import { ViewProps } from 'lib/store/types'

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
  const router = useRouter()
  const { view, closeView } = useAppStore()
  const { clerk } = useClerk()

  const topMenu = [
    {
      type: 'link',
      page: '/sell',
      text: 'SELL',
      badge: badges.numCartItems,
      class: 'bg-col1-light hover:bg-col1',
      icon: <SellIcon />,
    },
    {
      type: 'link',
      page: '/inventory',
      text: 'INVENTORY',
      class: 'bg-col2-light hover:bg-col2',
      icon: <InventoryIcon />,
    },
    {
      type: 'link',
      page: '/vendor',
      text: 'VENDORS',
      class: 'bg-col3-light hover:bg-col3',
      icon: <VendorsIcon />,
    },
    {
      type: 'link',
      page: '/payment',
      text: 'PAYMENTS',
      class: 'bg-col4-light hover:bg-col4',
      icon: <PaymentsIcon />,
    },
    {
      type: 'link',
      page: '/sale',
      text: 'SALES',
      class: 'bg-col5-light hover:bg-col5',
      icon: <SalesIcon />,
    },
    {
      type: 'link',
      page: '/layby',
      text: 'LAYBYS',
      class: 'bg-col6-light hover:bg-col6',
      icon: <LaybyIcon />,
    },
    {
      type: 'link',
      page: '/hold',
      text: 'HOLDS',
      class: 'bg-col7-light hover:bg-col7',
      icon: <HoldsIcon />,
    },
    {
      type: 'link',
      page: '/gift-card',
      text: 'GIFT CARDS',
      class: 'bg-col8-light hover:bg-col8',
      icon: <GiftCardsIcon />,
    },
  ]
  const bottomMenu = [
    {
      type: 'link',
      page: '/log',
      text: 'LOGS',
      class: 'bg-col9-light hover:bg-col9',
      icon: <LogsIcon />,
    },
    {
      type: 'link',
      page: '/jobs',
      text: 'JOBS',
      badge: badges.numJobsToDo,
      class: 'bg-col10-light hover:bg-col10',
      icon: <JobsIcon />,
    },
    {
      type: 'link',
      page: '/stocktake',
      text: 'STOCKTAKE',
      class: 'bg-col1-light hover:bg-col1',
      icon: <StocktakeIcon />,
    },
    {
      type: 'link',
      page: '/api/auth/logout',
      text: 'SWITCH CLERK',
      class: 'bg-col2-light hover:bg-col2',
      icon: <LogoutIcon />,
    },
  ]

  const defaultOnClick = (item) => {
    router.push(item?.page)
    closeView(ViewProps.mainMenu)
  }

  return (
    <div
      className={`w-0 overflow-y-auto flex flex-col h-main justify-between ${
        bg[clerk?.colour]
      } z-40 flex-shrink-0 whitespace-pre relative ${
        view?.mainMenu && 'w-full '
      }sm:w-full sm:w-menuSmall sm:border-r lg:w-menu transition-width duration-200 `}
    >
      <ul>
        {topMenu?.map((item: MenuType, i: number) => (
          <MenuItem key={i} item={item} defaultOnClick={defaultOnClick} />
        ))}
      </ul>
      <PyramidImage />
      <ul>
        {bottomMenu?.map((item: MenuType, i: number) => (
          <MenuItem key={i} item={item} defaultOnClick={defaultOnClick} />
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
