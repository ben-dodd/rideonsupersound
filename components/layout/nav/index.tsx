import InventoryNavActions from './actions/inventory'
import PaymentNavActions from './actions/payment'
import SellNavActions from './actions/sell'
import TaskNavActions from './actions/task'
import VendorNavActions from './actions/vendor'

import { bg } from 'lib/types'
import HelpIcon from '@mui/icons-material/Help'
import SaleNavActions from './actions/sale'
import StocktakeNavActions from './actions/stocktake'
import { useClerk } from 'lib/api/clerk'
import { ViewProps } from 'lib/store/types'
import { useAppStore } from 'lib/store'
import { useRouter } from 'next/router'
import { useCurrentRegister } from 'lib/api/register'

// REVIEW fix all actions and clean up files

export default function Nav() {
  // SWR
  // const { registerID } = useRegisterID()
  const { currentRegister } = useCurrentRegister()

  // Atoms
  const { clerk } = useClerk()
  const { openView } = useAppStore()
  const router = useRouter()
  const page = router.pathname
  console.log(page)

  return (
    <nav className={`py-2 ${bg[clerk?.colour]} text-white h-nav`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="ml-4 text-black text-4xl font-black">
            {clerk?.name?.toUpperCase()} @
          </div>
          <div className="ml-4">
            {/*<div className="sm:hidden">{`${clerk?.name?.toUpperCase()} @ R.O.S.S.`}</div>
            <div className="hidden sm:block">{`${clerk?.name?.toUpperCase()} @ RIDE ON SUPER SOUND`}</div>*/}
            <img
              src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/POS-RIDEONSUPERSOUNDLOGO.png`}
              alt="Ride On Super Sound"
              height="42px"
              width="493px"
            />
          </div>
        </div>
        <div className="flex mr-2">
          {page === 'sell' && currentRegister?.id > 0 && <SellNavActions />}
          {page === 'inventory' && <InventoryNavActions />}
          {page === 'vendors' && <VendorNavActions />}
          {page === 'payments' && <PaymentNavActions />}
          {page === 'jobs' && <TaskNavActions />}
          {page === 'stocktake' && <StocktakeNavActions />}
          {page === 'sale' && <SaleNavActions />}
          <button
            onClick={() => openView(ViewProps.helpDialog)}
            className="text-brown-dark hover:text-brown"
          >
            <HelpIcon />
          </button>
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
