import React from 'react'
import { useRouter } from 'next/router'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useRestockList } from 'lib/api/stock'
import { useJobsToDo } from 'lib/api/jobs'
import { SaleItemObject } from 'lib/types/sale'
import {
  LocalAtm as SellIcon,
  Category as InventoryIcon,
  Store as VendorsIcon,
  MonetizationOn as SalesIcon,
  DryCleaning as LaybyIcon,
  PanTool as HoldsIcon,
  Receipt as PaymentsIcon,
  LocalShipping as OrdersIcon,
  Storefront as RegistersIcon,
  Redeem as GiftCardsIcon,
  Task as JobsIcon,
  PeopleAlt as ClerksIcon,
  GridOn as LogsIcon,
  Numbers as StocktakeIcon,
  Close as CloseIcon,
} from '@mui/icons-material'

interface MenuItem {
  page: string
  text: string
  icon: React.ReactNode
  badge?: number
}

export const DrawerMenu: React.FC = () => {
  const router = useRouter()
  const { view, closeView, cart } = useAppStore()
  const { jobsToDo } = useJobsToDo()
  const { restockList } = useRestockList()

  const numCartItems = cart?.items?.reduce?.(
    (accumulator: number, item: SaleItemObject) => accumulator + (parseInt(item?.quantity) || 1),
    0,
  )

  const numJobsToDo = (jobsToDo?.length || 0) + (restockList?.length || 0)

  const topMenu: MenuItem[] = [
    { page: '/sell', text: 'SELL', icon: <SellIcon />, badge: numCartItems },
    { page: '/stock', text: 'STOCK', icon: <InventoryIcon /> },
    { page: '/vendors', text: 'VENDORS', icon: <VendorsIcon /> },
    { page: '/sales', text: 'SALES', icon: <SalesIcon /> },
    { page: '/laybys', text: 'LAYBYS', icon: <LaybyIcon /> },
    { page: '/holds', text: 'HOLDS', icon: <HoldsIcon /> },
    { page: '/payments', text: 'PAYMENTS', icon: <PaymentsIcon /> },
    { page: '/orders', text: 'ORDERS', icon: <OrdersIcon /> },
    { page: '/register', text: 'REGISTERS', icon: <RegistersIcon /> },
    { page: '/gift-cards', text: 'GIFT VOUCHERS', icon: <GiftCardsIcon /> },
    { page: '/jobs', text: 'JOBS', icon: <JobsIcon />, badge: numJobsToDo },
  ]

  const bottomMenu: MenuItem[] = [
    { page: '/clerks', text: 'CLERKS', icon: <ClerksIcon /> },
    { page: '/logs', text: 'LOGS', icon: <LogsIcon /> },
    { page: '/stocktake', text: 'STOCKTAKE', icon: <StocktakeIcon /> },
  ]

  const handleNavigation = (page: string) => {
    router.push(page)
    closeView(ViewProps.mainMenu)
  }

  const isActive = (page: string) => router.pathname.startsWith(page)

  if (!view?.mainMenu) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={() => closeView(ViewProps.mainMenu)}
      />

      {/* Drawer */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">MENU</h2>
          <button
            onClick={() => closeView(ViewProps.mainMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Top Menu Items */}
        <nav className="flex-1 overflow-y-auto py-2">
          {topMenu.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavigation(item.page)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 transition-colors border-l-4
                ${
                  isActive(item.page)
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-500'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-transparent'
                }
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="flex-1 text-left font-medium">{item.text}</span>
              {item.badge > 0 && (
                <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

        {/* Bottom Menu Items */}
        <nav className="py-2">
          {bottomMenu.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavigation(item.page)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 transition-colors border-l-4
                ${
                  isActive(item.page)
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-500'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-transparent'
                }
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="flex-1 text-left font-medium">{item.text}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  )
}
