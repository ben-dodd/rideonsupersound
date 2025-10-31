import React from 'react'
import { useRouter } from 'next/router'
import { useClerk } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { ViewProps } from 'lib/store/types'
import { useCurrentRegisterId } from 'lib/api/register'
import { usePageHeader } from '../PageHeaderContext'
import { useTheme } from 'lib/contexts/ThemeContext'
import DropdownMenu from 'components/dropdown-menu'
import {
  Menu as MenuIcon,
  Help as HelpIcon,
  PointOfSaleTwoTone,
  ExitToApp,
  Close as CloseIcon,
} from '@mui/icons-material'
import dynamic from 'next/dynamic'
const Tooltip = dynamic(() => import('@mui/material/Tooltip'))

interface UnifiedHeaderProps {
  pageTitle?: string
  tabs?: React.ReactNode
}

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({ pageTitle, tabs }) => {
  const { menuItems, actionButtons } = usePageHeader()
  const { theme, toggleTheme, isDark } = useTheme()
  const { clerk } = useClerk()
  const router = useRouter()
  const { openView, view, closeView, options: { doBypassRegister = false } = {}, setOption } = useAppStore()
  const { registerId } = useCurrentRegisterId()

  // Auto-detect page title and color from route
  const getPageInfo = () => {
    if (pageTitle) return { title: pageTitle, color: 'bg-gray-800' }

    const path = router.pathname
    const pageMap: Record<string, { title: string; color: string }> = {
      '/sell': { title: 'SELL', color: 'bg-col1' },
      '/stock': { title: 'STOCK', color: 'bg-col2' },
      '/vendors': { title: 'VENDORS', color: 'bg-col3' },
      '/sales': { title: 'SALES', color: 'bg-col4' },
      '/laybys': { title: 'LAYBYS', color: 'bg-col5' },
      '/holds': { title: 'HOLDS', color: 'bg-col6' },
      '/payments': { title: 'PAYMENTS', color: 'bg-col7' },
      '/orders': { title: 'ORDERS', color: 'bg-col8' },
      '/register': { title: 'REGISTERS', color: 'bg-col9' },
      '/gift-cards': { title: 'GIFT VOUCHERS', color: 'bg-col10' },
      '/jobs': { title: 'JOBS', color: 'bg-col1' },
      '/clerks': { title: 'CLERKS', color: 'bg-col2' },
      '/logs': { title: 'LOGS', color: 'bg-col3' },
      '/stocktake': { title: 'STOCKTAKE', color: 'bg-col4' },
    }

    // Find matching route
    for (const [route, info] of Object.entries(pageMap)) {
      if (path.startsWith(route)) {
        return info
      }
    }

    return { title: null, color: 'bg-gray-800' }
  }

  const { title: displayTitle, color: headerColor } = getPageInfo()

  const toggleMenu = () => {
    if (view?.mainMenu) {
      closeView(ViewProps.mainMenu)
    } else {
      openView(ViewProps.mainMenu)
    }
  }

  return (
    <header className={`h-navbar ${headerColor} text-black select-none shadow-md`}>
      <div className="h-full flex items-center justify-between px-4">
        {/* Left: Menu + Logo + Page Title */}
        <div className="flex items-center gap-4">
          <Tooltip title={view?.mainMenu ? 'Close Menu' : 'Open Menu'}>
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {view?.mainMenu ? <CloseIcon /> : <MenuIcon />}
            </button>
          </Tooltip>

          {displayTitle && (
            <>
              <div className="hidden sm:block">
                <img
                  src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/POS-RIDEONSUPERSOUNDLOGO.png`}
                  alt="Ride On Super Sound"
                  className="h-8"
                />
              </div>
              <div className="hidden sm:block h-6 w-px bg-white opacity-30 mx-2" />
              <h1 className="text-2xl font-bold italic">{displayTitle}</h1>
            </>
          )}
        </div>

        {/* Center: Tabs (if provided) */}
        {tabs && <div className="flex-1 mx-4 max-w-2xl">{tabs}</div>}

        {/* Right: Actions + User + Menu */}
        <div className="flex items-center gap-2">
          {actionButtons}

          {menuItems && <DropdownMenu items={menuItems} dark={true} />}

          <Tooltip title="Open Help">
            <button
              onClick={() => openView(ViewProps.helpDialog)}
              className="p-2 hover:bg-black hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <HelpIcon />
            </button>
          </Tooltip>

          <Tooltip title={`${registerId ? 'Close' : 'Open'} Register${doBypassRegister ? ' (Bypassed)' : ''}`}>
            <button
              onClick={() => {
                doBypassRegister && setOption('doBypassRegister', false)
                router.push(`/register/${registerId ? 'close' : 'open'}`)
              }}
              className={`p-2 rounded-lg transition-colors ${
                doBypassRegister ? 'text-red-300 hover:bg-red-900' : 'hover:bg-black hover:bg-opacity-20'
              }`}
            >
              <PointOfSaleTwoTone />
            </button>
          </Tooltip>

          <Tooltip title="Sign Out">
            <button
              onClick={() => router.push('/api/auth/logout')}
              className="p-2 hover:bg-black hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <ExitToApp />
            </button>
          </Tooltip>

          <div className="hidden sm:flex items-center ml-2 pl-2 border-l border-white border-opacity-30">
            <span className="text-sm font-bold">{clerk?.name?.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
