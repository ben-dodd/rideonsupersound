import { CloseRounded } from '@mui/icons-material'
import SidebarContainer from 'components/container/side-bar'
import TextField from 'components/inputs/text-field'
import Loading from 'components/placeholders/loading'
import dayjs from 'dayjs'
import HoldListItem from 'features/sell/create-hold/list-item'
import { updateHold, useHolds } from 'lib/api/sale'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { ModalButton } from 'lib/types'
import { getObjectDifference } from 'lib/utils'
import React, { useState } from 'react'

const HoldsSidebar = () => {
  const { holdsPage, setPage, setAlert } = useAppStore()
  const { holds, isHoldsLoading } = useHolds()
  const originalHold = holds?.find((hold) => hold?.id === holdsPage?.loadedHold)
  const [hold, setHold] = useState(originalHold || {})
  const [submitting, setSubmitting] = useState(false)
  console.log(hold)
  const closeSidebar = () => setPage(Pages.holdsPage, { loadedHold: 0 })

  const handleSubmit = (e) => {
    e.preventDefault()
    onClickUpdateHold()
  }

  async function onClickUpdateHold() {
    setSubmitting(true)
    await updateHold(getObjectDifference(hold, originalHold), originalHold?.id)
    setSubmitting(false)
    closeSidebar()
    setHold({})
    setAlert({
      open: true,
      type: 'success',
      message: `HOLD UPDATED.`,
    })
  }

  const buttons: ModalButton[] = [
    {
      type: 'cancel',
      onClick: () => {
        closeSidebar()
        setHold({})
      },
      text: 'CANCEL',
    },
    {
      type: 'ok',
      onClick: onClickUpdateHold,
      disabled:
        (hold?.holdPeriod === originalHold?.holdPeriod && hold?.note === originalHold?.note) ||
        isNaN(parseInt(hold?.holdPeriod)),
      text: submitting ? 'UPDATING...' : 'UPDATE HOLD',
    },
  ]

  return (
    <SidebarContainer show={Boolean(holdsPage?.loadedHold)} buttons={buttons} handleSubmit={handleSubmit}>
      {isHoldsLoading ? (
        <Loading />
      ) : (
        <div>
          <div className="flex justify-between items-start h-header">
            <div />
            <div className="text-4xl font-mono py-2">HOLD</div>
            <button className="mt-2" onClick={closeSidebar}>
              <CloseRounded />
            </button>
          </div>
          <div className="p-4">
            <HoldListItem cartItem={hold} />
            <div>{`Item held for ${hold?.customerName} (hold set up by ${hold?.openClerkName})`}</div>
            <div>{`Item held for ${dayjs().diff(hold?.dateFrom, 'day')} of ${hold?.holdPeriod || 30} days.`}</div>
            <TextField
              inputLabel="Hold Period"
              inputType="number"
              min={0}
              error={isNaN(parseInt(hold?.holdPeriod)) || hold?.holdPeriod < 0}
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
