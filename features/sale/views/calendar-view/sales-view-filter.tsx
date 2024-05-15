import dynamic from 'next/dynamic'
import { CalendarViewDay, CalendarViewMonth, CalendarViewWeek, Close } from '@mui/icons-material'
const Chip = dynamic(() => import('@mui/material/Chip'))
import dayjs from 'dayjs'
import { useClerks } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'
import { dateYMD } from 'lib/types/date'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'

export default function SalesViewFilter() {
  const { salesCalendarPage, setPage, togglePageOption } = useAppStore()
  const { clerks } = useClerks()
  const { viewPeriod, rangeStartDate, rangeEndDate, clerkIds, viewLaybysOnly } = salesCalendarPage || {}
  return (
    <div className="bg-white p-2 shadow-md">
      <div className="flex items-center my-2">
        <div className="flex items-center">
          <div className="font-bold mx-2">SET VIEW</div>
          <Tooltip title="View Today's Sales">
            <IconButton
              onClick={() => {
                setPage(Pages.salesCalendarPage, {
                  viewPeriod: 'day',
                  rangeStartDate: dayjs().format(dateYMD),
                  rangeEndDate: dayjs().format(dateYMD),
                })
              }}
            >
              <CalendarViewDay className={`${viewPeriod === 'day' ? 'text-primary' : ''}`} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View This Week's Sales">
            <IconButton
              onClick={() => {
                setPage(Pages.salesCalendarPage, {
                  viewPeriod: 'week',
                  rangeStartDate: dayjs().startOf('week').format(dateYMD),
                  rangeEndDate: dayjs().format(dateYMD),
                })
              }}
            >
              <CalendarViewWeek className={`${viewPeriod === 'week' ? 'text-primary' : ''}`} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View This Month's Sales">
            <IconButton
              onClick={() => {
                setPage(Pages.salesCalendarPage, {
                  viewPeriod: 'month',
                  rangeStartDate: dayjs().startOf('month').format(dateYMD),
                  rangeEndDate: dayjs().format(dateYMD),
                })
              }}
            >
              <CalendarViewMonth className={`${viewPeriod === 'month' ? 'text-primary' : ''}`} />
            </IconButton>
          </Tooltip>
        </div>
        <div className="mx-2">|</div>
        <div className="flex items-center">
          <div className="font-bold mr-2">SET RANGE FROM</div>
          <input
            type="date"
            onChange={(e) => {
              setPage(Pages.salesCalendarPage, { viewPeriod: null, rangeStartDate: e.target.value })
            }}
            value={rangeStartDate}
          />
          <div className="font-bold mx-2">TO</div>
          <input
            type="date"
            onChange={(e) => {
              setPage(Pages.salesCalendarPage, { viewPeriod: null, rangeEndDate: e.target.value })
            }}
            value={rangeEndDate}
          />
        </div>
        <div className="mx-2">|</div>
        <Chip
          label="View Laybys Only"
          color={viewLaybysOnly ? 'secondary' : 'default'}
          onClick={() => togglePageOption(Pages.salesCalendarPage, 'viewLaybysOnly')}
        />
      </div>
      <div className="flex overflow-x-scroll mb-2">
        <div className="mr-1">
          <Chip icon={<Close />} onClick={() => setPage(Pages.salesCalendarPage, { clerkIds: [] })} size="small" />
        </div>
        {clerks
          ?.sort((a, b) => a?.name?.localeCompare(b?.name))
          ?.sort((a, b) => b?.is_current - a?.is_current)
          ?.map((clerk) => (
            <div key={clerk?.id} className="mr-1">
              <Chip
                label={clerk?.name}
                color={clerkIds?.includes(clerk?.id) ? 'secondary' : 'default'}
                size="small"
                onClick={() =>
                  setPage(
                    Pages.salesCalendarPage,
                    clerkIds?.includes(clerk?.id)
                      ? clerkIds?.filter((clerkId) => clerkId !== clerk?.id)
                      : [...clerkIds, clerk?.id],
                  )
                }
              />
            </div>
          ))}
      </div>
    </div>
  )
}
