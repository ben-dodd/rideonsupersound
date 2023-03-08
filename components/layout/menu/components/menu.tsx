import { bg } from 'lib/types'
import InventoryIcon from '@mui/icons-material/Category'
import LaybyIcon from '@mui/icons-material/DryCleaning'
// import LogsIcon from '@mui/icons-material/GridOn'
import OrdersIcon from '@mui/icons-material/LocalShipping'
import ClerksIcon from '@mui/icons-material/PeopleAlt'
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

const classList = [...Array(10)].map((_, i) => `bg-col${i + 1}-light hover:bg-col${i + 1}`)

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
      icon: <SellIcon />,
    },
    {
      type: 'link',
      page: '/inventory',
      text: 'STOCK',
      icon: <InventoryIcon />,
    },
    {
      type: 'link',
      page: '/vendors',
      text: 'VENDORS',
      icon: <VendorsIcon />,
    },
    {
      type: 'link',
      page: '/sales',
      text: 'SALES',
      icon: <SalesIcon />,
    },
    {
      type: 'link',
      page: '/laybys',
      text: 'LAYBYS',
      icon: <LaybyIcon />,
    },
    {
      type: 'link',
      page: '/holds',
      text: 'HOLDS',
      icon: <HoldsIcon />,
    },
    {
      type: 'link',
      page: '/orders',
      text: 'ORDERS',
      icon: <OrdersIcon />,
    },
    {
      type: 'link',
      page: '/gift-cards',
      text: 'GIFT VOUCHERS',
      icon: <GiftCardsIcon />,
    },
    {
      type: 'link',
      page: '/jobs',
      text: 'JOBS',
      badge: badges.numJobsToDo,
      icon: <JobsIcon />,
    },
  ]
  const bottomMenu = [
    {
      type: 'link',
      page: '/payments',
      text: 'BUSINESS',
      icon: <PaymentsIcon />,
    },
    {
      type: 'link',
      page: '/clerks',
      text: 'CLERKS',
      icon: <ClerksIcon />,
    },
    {
      type: 'link',
      page: '/stocktake',
      text: 'STOCKTAKE',
      icon: <StocktakeIcon />,
    },
  ]

  const defaultOnClick = (item) => {
    router.push(item?.page)
    closeView(ViewProps.mainMenu)
  }

  return (
    <div
      className={`w-0 overflow-y-auto flex flex-col h-main justify-between select-none ${
        bg[clerk?.colour]
      } z-30 flex-shrink-0 whitespace-pre relative ${
        view?.mainMenu && 'w-full '
      }sm:w-full sm:w-menuSmall sm:border-r lg:w-menu transition-width duration-200 `}
    >
      <ul>
        {topMenu?.map((item: MenuType, i: number) => (
          <MenuItem key={i} item={item} listClass={classList[i % 10]} defaultOnClick={defaultOnClick} />
        ))}
      </ul>
      <PyramidImage />
      <ul>
        {bottomMenu?.map((item: MenuType, i: number) => (
          <MenuItem key={i} item={item} listClass={classList[i % 10]} defaultOnClick={defaultOnClick} />
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
