import 'primereact/resources/themes/lara-light-indigo/theme.css' //theme
import 'primereact/resources/primereact.min.css' //core css
import 'primeicons/primeicons.css' //icons
import '../styles/index.css'
import { Auth0Provider } from '@auth0/auth0-react'
import { Provider as JotaiProvider } from 'jotai'
// import { SessionProvider } from "next-auth/react";

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import duration from 'dayjs/plugin/duration'
import minMax from 'dayjs/plugin/minMax'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import tz from 'dayjs/plugin/timezone'
import relative from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
// import "dayjs/locale/en-nz";

function MyApp({ Component, pageProps }) {
  dayjs.extend(utc)
  // dayjs.extend(duration);
  dayjs.extend(isLeapYear)
  dayjs.extend(tz)
  dayjs.extend(relative)
  dayjs.extend(minMax)
  dayjs.extend(isBetween)
  // dayjs.locale("en-nz");

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_ISSUER}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
    >
      <JotaiProvider>
        <Component {...pageProps} />
      </JotaiProvider>
    </Auth0Provider>
  )
}

export default MyApp
