import HelpIcon from '@mui/icons-material/Help'
import { useClerk } from 'lib/api/clerk'
import { ViewProps } from 'lib/store/types'
import { useAppStore } from 'lib/store'
import { useRouter } from 'next/router'
import { ExitToApp, PointOfSaleTwoTone } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import { useCurrentRegisterId } from 'lib/api/register'

// REVIEW fix all actions and clean up files

export default function Nav() {
  const { clerk } = useClerk()
  const { openView, options: { doBypassRegister = false } = {}, setOption } = useAppStore()
  const { registerId } = useCurrentRegisterId()
  const router = useRouter()

  return (
    <nav className={`py-2 bg-col10 text-white h-navbar select-none`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="hidden sm:inline ml-4 text-black text-2xl font-black">{clerk?.name?.toUpperCase()} @</div>
          <div className="ml-4">
            <img
              src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/POS-RIDEONSUPERSOUNDLOGO.png`}
              alt="Ride On Super Sound"
              width="300px"
            />
          </div>
        </div>
        <div className="flex mr-2">
          <Tooltip title="Open Help">
            <button onClick={() => openView(ViewProps.helpDialog)} className="text-brown-dark hover:text-brown">
              <HelpIcon />
            </button>
          </Tooltip>
          <Tooltip title={`${registerId ? 'Close' : 'Open'} Register${doBypassRegister ? ' (Register Bypassed)' : ''}`}>
            <button
              onClick={() => {
                doBypassRegister && setOption('doBypassRegister', false)
                router.push(`/register/${registerId ? 'close' : 'open'}`)
              }}
              className={`ml-2 ${
                doBypassRegister ? 'text-red-500 hover:text-red-600' : 'text-brown-dark hover:text-brown'
              }`}
            >
              <PointOfSaleTwoTone />
            </button>
          </Tooltip>
          <Tooltip title="Sign Out">
            <button onClick={() => router.push('/api/auth/logout')} className="ml-2 text-brown-dark hover:text-brown">
              <ExitToApp />
            </button>
          </Tooltip>
        </div>
      </div>
    </nav>
  )
}
