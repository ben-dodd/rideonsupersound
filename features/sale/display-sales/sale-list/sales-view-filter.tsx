import { CalendarViewDay, CalendarViewMonth, CalendarViewWeek, Close } from '@mui/icons-material'
import { Chip, IconButton, Tooltip } from '@mui/material'
import dayjs from 'dayjs'
import { useClerks } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'
import { Pages } from 'lib/store/types'

export default function SalesViewFilter() {
  const { salesPage, setPage, togglePageOption } = useAppStore()
  const { clerks } = useClerks()
  const { viewPeriod, rangeStartDate, rangeEndDate, clerkIds, viewLaybysOnly } = salesPage || {}
  return (
    <div className="bg-white p-2 shadow-md">
      <div className="flex items-center my-2">
        <div className="flex items-center">
          <div className="font-bold mx-2">SET VIEW</div>
          <Tooltip title="View Today's Sales">
            <IconButton
              onClick={() => {
                setPage(Pages.salesPage, {
                  viewPeriod: 'day',
                  rangeStartDate: dayjs().format('YYYY-MM-DD'),
                  rangeEndDate: dayjs().format('YYYY-MM-DD'),
                })
              }}
            >
              <CalendarViewDay className={`${viewPeriod === 'day' ? 'text-primary' : ''}`} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View This Week's Sales">
            <IconButton
              onClick={() => {
                setPage(Pages.salesPage, {
                  viewPeriod: 'week',
                  rangeStartDate: dayjs().startOf('week').format('YYYY-MM-DD'),
                  rangeEndDate: dayjs().format('YYYY-MM-DD'),
                })
              }}
            >
              <CalendarViewWeek className={`${viewPeriod === 'week' ? 'text-primary' : ''}`} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View This Month's Sales">
            <IconButton
              onClick={() => {
                setPage(Pages.salesPage, {
                  viewPeriod: 'month',
                  rangeStartDate: dayjs().startOf('month').format('YYYY-MM-DD'),
                  rangeEndDate: dayjs().format('YYYY-MM-DD'),
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
              setPage(Pages.salesPage, { viewPeriod: null, rangeStartDate: e.target.value })
            }}
            value={rangeStartDate}
          />
          <div className="font-bold mx-2">TO</div>
          <input
            type="date"
            onChange={(e) => {
              setPage(Pages.salesPage, { viewPeriod: null, rangeEndDate: e.target.value })
            }}
            value={rangeEndDate}
          />
        </div>
        <div className="mx-2">|</div>
        <Chip
          label="View Laybys Only"
          color={viewLaybysOnly ? 'secondary' : 'default'}
          onClick={() => togglePageOption(Pages.salesPage, 'viewLaybysOnly')}
        />
      </div>
      <div className="flex overflow-x-scroll mb-2">
        <div className="mr-1">
          <Chip icon={<Close />} onClick={() => setPage(Pages.salesPage, { clerkIds: [] })} size="small" />
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
                    Pages.salesPage,
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
