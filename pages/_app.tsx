import '../styles/index.css'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

function MyApp({ Component, pageProps }) {
  dayjs.extend(isBetween)
  return <Component {...pageProps} />
}

export default MyApp
