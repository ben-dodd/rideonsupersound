import { CloseRounded } from '@mui/icons-material'
import SidebarContainer from 'components/container/side-bar'
import TextField from 'components/inputs/text-field'
import Loading from 'components/placeholders/loading'
import dayjs from 'dayjs'
import HoldListItem from 'features/sell/create-hold/list-item'
import { cancelHold, updateHold, useHolds } from 'lib/api/sale'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { ModalButton } from 'lib/types'
import { HoldObject } from 'lib/types/sale'
import React, { useEffect, useState } from 'react'
import Warning from '../warning'
import { useRouter } from 'next/router'
import { useClerk } from 'lib/api/clerk'
import { useSWRConfig } from 'swr'

const HoldsSidebar = () => {
  const { cart, holdsPage, setAlert, openConfirm, setPage, addCartItem } = useAppStore()
  const { holds, isHoldsLoading } = useHolds()
  const { clerk } = useClerk()
  const [originalHold, setOriginalHold]: [HoldObject, Function] = useState({})
  const [hold, setHold]: [HoldObject, Function] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const closeSidebar = () => setPage(Pages.holdsPage, { loadedHold: 0 })
  const router = useRouter()
  const { mutate } = useSWRConfig()

  const handleSubmit = (e) => {
    e.preventDefault()
    onClickUpdateHold()
  }

  const closeHold = () => {
    closeSidebar()
    setHold({})
  }

  useEffect(() => {
    const originalHold = holds?.find((hold) => hold?.id === holdsPage?.loadedHold)
    setHold(originalHold || {})
    setOriginalHold(originalHold || {})
  }, [holds, holdsPage?.loadedHold])

  function onClickCancelHold() {
    // Delete hold, unhold stock movement
    // Add return to stock to jobs
    openConfirm({
      open: true,
      title: 'Cancel hold and return item to stock?',
      action: () =>
        cancelHold(hold, clerk).then(() => {
          setAlert({ open: true, type: 'success', message: `Hold for ${hold?.customerName} cancelled.` })
          closeHold()
        }),
    })
  }

  function onClickLoadToCart() {
    // Check if override current cart (if applicable)
    // Load to cart
    if (!cart?.sale?.id && cart?.items?.length === 0) {
      // Cart is empty
      loadHoldItemToCart()
    } else {
      // Check whether to add to current cart or park current cart
      setPage(Pages.salesPage, {
        returnToCartDialog: {
          open: true,
          hold,
          onClick: loadHoldItemToCart,
        },
      })
    }
  }

  const loadHoldItemToCart = (replaceCart = false) => {
    addCartItem({ itemId: hold?.itemId, quantity: `${hold?.quantity}`, holdId: hold?.id }, clerk?.id, replaceCart)
    router.push('/sell')
    closeHold()
    cancelHold(hold, clerk, true).then(() => mutate(`sale/hold`))
  }

  async function onClickUpdateHold() {
    setSubmitting(true)
    await updateHold({ holdPeriod: parseInt(`${hold?.holdPeriod}`), note: hold?.note }, originalHold?.id)
    mutate(`sale/hold`)
    setSubmitting(false)
    closeHold()
    setAlert({
      open: true,
      type: 'success',
      message: `HOLD UPDATED.`,
    })
  }

  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      onClick: onClickCancelHold,
      text: 'CANCEL HOLD',
    },
    {
      type: 'alt1',
      onClick: onClickLoadToCart,
      text: 'LOAD TO CART',
    },
    {
      type: 'ok',
      onClick: onClickUpdateHold,
      disabled:
        (hold?.holdPeriod === originalHold?.holdPeriod && hold?.note === originalHold?.note) ||
        isNaN(parseInt(`${hold?.holdPeriod}`)),
      text: submitting ? 'UPDATING...' : 'UPDATE HOLD',
    },
  ]

  return (
    <SidebarContainer show={Boolean(holdsPage?.loadedHold)} buttons={buttons} handleSubmit={handleSubmit}>
      {isHoldsLoading ? (
        <Loading />
      ) : (
        <div className="h-content">
          <div className="flex justify-between items-start h-header">
            <div />
            <div className="text-4xl font-mono py-2">HOLD</div>
            <button className="mt-2 ml-2" onClick={closeSidebar}>
              <CloseRounded />
            </button>
          </div>
          <div className="p-4 h-full">
            <div className="cursor-pointer hover:opacity-80" onClick={() => router.push(`/stock/${hold?.itemId}`)}>
              <HoldListItem cartItem={hold} />
            </div>
            <div>{`Item held for ${hold?.customerName} (hold set up by ${hold?.openClerkName})`}</div>
            <div>{`Item held for ${dayjs().diff(hold?.dateFrom, 'day')} of ${hold?.holdPeriod || 30} days.`}</div>
            <Warning hold={hold} />
            <TextField
              inputLabel="Hold Period"
              inputType="number"
              min={0}
              error={isNaN(parseInt(`${hold?.holdPeriod}`)) || hold?.holdPeriod < 0}
              valueNum={hold?.holdPeriod}
              onChange={(e: any) => setHold({ ...hold, holdPeriod: e.target.value })}
            />
            <TextField
              inputLabel="Notes"
              className="mb-4"
              value={hold?.note}
              onChange={(e: any) => setHold({ ...hold, note: e.target.value })}
              multiline
            />
          </div>
        </div>
      )}
    </SidebarContainer>
  )
}

export default HoldsSidebar
