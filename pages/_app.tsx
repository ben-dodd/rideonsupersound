import { extend } from 'dayjs'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import minMax from 'dayjs/plugin/minMax'
import relative from 'dayjs/plugin/relativeTime'
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import '../styles/index.css'

const MyApp = ({ Component, pageProps }) => {
  extend(utc)
  extend(duration)
  extend(isLeapYear)
  extend(tz)
  extend(relative)
  extend(minMax)
  extend(isBetween)
  extend(isSameOrAfter)
  extend(isSameOrBefore)

  const getLayout = Component.getLayout || ((page) => page)
  return getLayout(<Component {...pageProps} />)
}

export default MyApp
