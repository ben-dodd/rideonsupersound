// import 'primereact/resources/themes/lara-light-indigo/theme.css' //theme
// import 'primereact/resources/primereact.min.css' //core css
// import 'primeicons/primeicons.css' //icons
import '../styles/index.css'
import { extend } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import duration from 'dayjs/plugin/duration'
import minMax from 'dayjs/plugin/minMax'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import tz from 'dayjs/plugin/timezone'
import relative from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
// import "dayjs/locale/en-nz";
import { UserProvider } from '@auth0/nextjs-auth0/client'
// import { SessionProvider } from "next-auth/react";

const MyApp = ({ Component, pageProps }) => {
  // const [origin, setOrigin] = useState('http://localhost:3000')
  // useEffect(() => setOrigin(window.location.origin), [])
  extend(utc)
  extend(duration)
  extend(isLeapYear)
  extend(tz)
  extend(relative)
  extend(minMax)
  extend(isBetween)
  // dayjs.locale("en-nz");

  const getLayout = Component.getLayout || ((page) => page)
  return <UserProvider>{getLayout(<Component {...pageProps} />)}</UserProvider>
}

export default MyApp
