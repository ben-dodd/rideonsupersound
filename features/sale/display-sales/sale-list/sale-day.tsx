import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import dayjs from 'dayjs'
import { useClerks } from 'lib/api/clerk'
import { priceCentsString } from 'lib/utils'
import { useState } from 'react'
import SaleDaySale from './sale-day-sale'

const SaleDay = ({ saleDay }) => {
  const [expanded, setExpanded] = useState(false)
  const { clerks = [] } = useClerks() || {}
  const getSaleDaySummary = () => {
    const saleDayClerks = []
    saleDay?.sales?.forEach((sale) => {
      sale?.transactions?.forEach((transaction) => {
        if (transaction?.clerkId && !saleDayClerks.includes(transaction?.clerkId))
          saleDayClerks?.push(transaction?.clerkId)
      })
    })
    const saleNum = saleDay?.sales?.length
    return `[${
      saleDayClerks?.length === 0
        ? ''
        : `${saleDayClerks
            ?.map((saleDayClerk) => clerks?.find((clerk) => clerk?.id === saleDayClerk)?.name)
            ?.join(', ')}; `
    }${saleNum} SALES]`
  }

  return (
    <div>
      <div
        className="border-b bg-gray-100 border-gray-300 border-double font-bold flex justify-between cursor-pointer px-2 py-2"
        onClick={() => setExpanded((expanded) => !expanded)}
      >
        <div className="flex">
          <div>{dayjs(saleDay?.day).format('dddd, MMMM D, YYYY')}</div>
          <div className="font-light ml-2">{getSaleDaySummary()}</div>
        </div>
        <div className="flex">
          <div>{priceCentsString(saleDay?.total)}</div>
          <div className="self-end ml-1">{expanded ? <ArrowDropUp /> : <ArrowDropDown />}</div>
        </div>
      </div>
      <div className={expanded ? 'bg-white px-2' : 'hidden'}>
        {saleDay?.sales?.map?.((sale: any) => (
          <SaleDaySale key={sale?.id} sale={sale} />
        ))}
      </div>
    </div>
  )
}

export default SaleDay
