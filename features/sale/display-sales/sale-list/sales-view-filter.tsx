import { CalendarViewDay, CalendarViewMonth, CalendarViewWeek, Close } from '@mui/icons-material'
import { Chip, IconButton, Tooltip } from '@mui/material'
import dayjs from 'dayjs'
import { useClerks } from 'lib/api/clerk'
import { useAppStore } from 'lib/store'

export default function SalesViewFilter() {
  const { salesView, setSalesView, salesViewRange, setSalesViewRange, salesViewClerks, setSalesViewClerks } =
    useAppStore()
  const { clerks } = useClerks()
  console.log(salesViewRange)
  return (
    <div>
      <div className="flex items-center my-2">
        <div className="flex items-center">
          <div className="font-bold mx-2">SET VIEW</div>
          <Tooltip title="View Today's Sales">
            <IconButton
              onClick={() => {
                setSalesView('day')
                setSalesViewRange({
                  startDate: dayjs().format('YYYY-MM-DD'),
                  endDate: dayjs().format('YYYY-MM-DD'),
                })
              }}
            >
              <CalendarViewDay className={`${salesView === 'day' ? 'text-primary' : ''}`} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View This Week's Sales">
            <IconButton
              onClick={() => {
                setSalesView('week')
                setSalesViewRange({
                  startDate: dayjs().startOf('week').format('YYYY-MM-DD'),
                  endDate: dayjs().format('YYYY-MM-DD'),
                })
              }}
            >
              <CalendarViewWeek className={`${salesView === 'week' ? 'text-primary' : ''}`} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View This Month's Sales">
            <IconButton
              onClick={() => {
                setSalesView('month')
                setSalesViewRange({
                  startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
                  endDate: dayjs().format('YYYY-MM-DD'),
                })
              }}
            >
              <CalendarViewMonth className={`${salesView === 'month' ? 'text-primary' : ''}`} />
            </IconButton>
          </Tooltip>
        </div>
        <div className="mx-2">|</div>
        <div className="flex items-center">
          <div className="font-bold mr-2">SET RANGE FROM</div>
          <input
            type="date"
            onChange={(e) => {
              setSalesView(null)
              setSalesViewRange({
                ...salesViewRange,
                startDate: e.target.value,
              })
            }}
            value={salesViewRange?.startDate}
          />
          <div className="font-bold mx-2">TO</div>
          <input
            type="date"
            onChange={(e) => {
              setSalesView(null)
              setSalesViewRange({ ...salesViewRange, endDate: e.target.value })
            }}
            value={salesViewRange?.endDate}
          />
        </div>
      </div>
      <div className="flex overflow-x-scroll mb-2">
        <div className="mr-1">
          <Chip icon={<Close />} onClick={() => setSalesViewClerks([])} size="small" />
        </div>
        {clerks
          ?.sort((a, b) => a?.name?.localeCompare(b?.name))
          ?.sort((a, b) => b?.is_current - a?.is_current)
          ?.map((clerk) => (
            <div key={clerk?.id} className="mr-1">
              <Chip
                label={clerk?.name}
                color={salesViewClerks?.includes(clerk?.id) ? 'secondary' : 'default'}
                size="small"
                onClick={() =>
                  setSalesViewClerks(
                    salesViewClerks?.includes(clerk?.id)
                      ? salesViewClerks?.filter((clerkId) => clerkId !== clerk?.id)
                      : [...salesViewClerks, clerk?.id],
                  )
                }
              />
            </div>
          ))}
      </div>
    </div>
  )
}
