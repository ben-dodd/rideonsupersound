import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import minMax from 'dayjs/plugin/minMax'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import tz from 'dayjs/plugin/timezone'
import relative from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import AuthContext from './AuthContext'

export default async function RootLayout({
  children,
  props,
}: {
  children: React.ReactNode
  props?: any
}) {
  dayjs.extend(utc)
  // dayjs.extend(duration);
  dayjs.extend(isLeapYear)
  dayjs.extend(tz)
  dayjs.extend(relative)
  dayjs.extend(minMax)
  dayjs.extend(isBetween)
  return (
    <html lang="en">
      <body>
        <AuthContext>{children}</AuthContext>
      </body>
    </html>
  )
}

// JotaiProvider
