// import 'primereact/resources/themes/lara-light-indigo/theme.css' //theme
// import 'primereact/resources/primereact.min.css' //core css
// import 'primeicons/primeicons.css' //icons
import { Auth0Provider } from '@auth0/nextjs-auth0'
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
// import "dayjs/locale/en-nz";
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
  extend(isSameOrAfter)
  extend(isSameOrBefore)
  // dayjs.locale("en-nz");

  const getLayout = Component.getLayout || ((page) => page)
  return <Auth0Provider>{getLayout(<Component {...pageProps} />)}</Auth0Provider>
}

export default MyApp
