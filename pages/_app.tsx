import 'primereact/resources/themes/lara-light-indigo/theme.css' //theme
import 'primereact/resources/primereact.min.css' //core css
import 'primeicons/primeicons.css' //icons
import '../styles/index.css'
// import { Provider as NextAuthProvider } from 'next-auth/client'
import { UserProvider } from '@auth0/nextjs-auth0/client'
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
    // <NextAuthProvider
    //   // Provider options are not required but can be useful in situations where
    //   // you have a short session maxAge time. Shown here with default values.
    //   options={{
    //     // Client Max Age controls how often the useSession in the client should
    //     // customer the server to sync the session state. Value in seconds.
    //     // e.g.
    //     // * 0  - Disabled (always use cache value)
    //     // * 60 - Sync session state with server if it's older than 60 seconds
    //     clientMaxAge: 0,
    //     // Keep Alive tells windows / tabs that are signed in to keep sending
    //     // a keep alive request (which extends the current session expiry) to
    //     // prevent sessions in open windows from expiring. Value in seconds.
    //     //
    //     // Note: If a session has expired when keep alive is triggered, all open
    //     // windows / tabs will be updated to reflect the user is signed out.
    //     keepAlive: 0,
    //   }}
    //   session={pageProps.session}
    // >
    <UserProvider>
      <JotaiProvider>
        <Component {...pageProps} />
      </JotaiProvider>
    </UserProvider>
    // </NextAuthProvider>
  )
}

export default MyApp
