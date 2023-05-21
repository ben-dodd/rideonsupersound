import dayjs from 'dayjs'

const Warning = ({ hold }) => {
  const overdue = dayjs().diff(hold?.dateFrom, 'day') >= hold?.holdPeriod
  const nearOverdue = !overdue && dayjs().diff(hold?.dateFrom, 'day') >= hold?.holdPeriod - 7
  return overdue || nearOverdue ? (
    <div className={`${nearOverdue ? 'text-yellow-400' : 'text-red-400'} font-bold text-2xl my-4`}>
      {overdue ? 'HOLD PERIOD OVER!' : 'HOLD WILL EXPIRE SOON'}
    </div>
  ) : (
    <div />
  )
}

export default Warning
