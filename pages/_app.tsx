import 'primereact/resources/themes/lara-light-indigo/theme.css' //theme
import 'primereact/resources/primereact.min.css' //core css
import 'primeicons/primeicons.css' //icons
import '../styles/index.css'
import { Provider as JotaiProvider } from 'jotai'
import { UserProvider } from '@auth0/nextjs-auth0'
// import { SessionProvider } from "next-auth/react";

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import duration from 'dayjs/plugin/duration'
import minMax from 'dayjs/plugin/minMax'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import tz from 'dayjs/plugin/timezone'
import relative from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import { useEffect, useState } from 'react'
// import "dayjs/locale/en-nz";

function MyApp({ Component, pageProps }) {
  const [origin, setOrigin] = useState('http://localhost:3000')
  useEffect(() => setOrigin(window.location.origin), [])
  dayjs.extend(utc)
  // dayjs.extend(duration);
  dayjs.extend(isLeapYear)
  dayjs.extend(tz)
  dayjs.extend(relative)
  dayjs.extend(minMax)
  dayjs.extend(isBetween)
  // dayjs.locale("en-nz");

  const getLayout = Component.getLayout || ((page) => page)

  return (
    <UserProvider>
      <JotaiProvider>{getLayout(<Component {...pageProps} />)}</JotaiProvider>
    </UserProvider>
  )
}

export default MyApp
