import { bg } from 'lib/types'
import HelpIcon from '@mui/icons-material/Help'
import { useClerk } from 'lib/api/clerk'
import { ViewProps } from 'lib/store/types'
import { useAppStore } from 'lib/store'
import { useRouter } from 'next/router'
import { ExitToApp, PointOfSaleTwoTone } from '@mui/icons-material'
import { Tooltip } from '@mui/material'

// REVIEW fix all actions and clean up files

export default function Nav() {
  const { clerk } = useClerk()
  const { openView } = useAppStore()
  const router = useRouter()
  const page = router.pathname

  return (
    <nav className={`py-2 ${bg[clerk?.colour]} text-white h-navbar select-none`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="hidden sm:inline ml-4 text-black text-2xl font-black">{clerk?.name?.toUpperCase()} @</div>
          <div className="ml-4">
            {/*<div className="sm:hidden">{`${clerk?.name?.toUpperCase()} @ R.O.S.S.`}</div>
            <div className="hidden sm:block">{`${clerk?.name?.toUpperCase()} @ RIDE ON SUPER SOUND`}</div>*/}
            <img
              src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/POS-RIDEONSUPERSOUNDLOGO.png`}
              alt="Ride On Super Sound"
              width="300px"
            />
          </div>
        </div>
        <div className="flex mr-2">
          {/* {page.includes('sell') && (currentRegister?.id > 0 ? <SellNavActions /> : <OpenRegisterNavActions />)}
          {page.includes('inventory') && <InventoryNavActions />}
          {page.includes('vendors') && <VendorNavActions />}
          {page.includes('payments') && <PaymentNavActions />}
          {page.includes('jobs') && <TaskNavActions />}
          {page.includes('stocktake') && <StocktakeNavActions />}
          {page.includes('sales') && <SaleNavActions />} */}
          <Tooltip title="Open Help">
            <button onClick={() => openView(ViewProps.helpDialog)} className="text-brown-dark hover:text-brown">
              <HelpIcon />
            </button>
          </Tooltip>
          <Tooltip title="Close Register">
            <button onClick={() => router.push('/register/close')} className="ml-2 text-brown-dark hover:text-brown">
              <PointOfSaleTwoTone />
            </button>
          </Tooltip>
          <Tooltip title="Sign Out">
            <button onClick={() => router.push('/api/auth/logout')} className="ml-2 text-brown-dark hover:text-brown">
              <ExitToApp />
            </button>
          </Tooltip>
        </div>
        {/*<button
          className="px-4 sm:hidden"
          onClick={() => setView({...view, mainMenu: !view?.mainMenu})}
        >
          <Hamburger />
        </button>*/}
      </div>
    </nav>
  )
}

// <div
// className="bg-white rounded-full mx-2">
// <Image
//
//   layout="fill"
//   src={`${image ? URL.createObjectURL(blob) : "/clerk/guest.png"}`}
//   alt={clerk?.name}
// /></div>
