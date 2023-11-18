import { useRouter } from 'next/router'

const Title = ({ item }) => {
  const router = useRouter()
  return (
    <div>
      <div className="font-bold text-md link-blue" onClick={() => router.push(`/stock/${item?.id}`)}>{`${
        item?.displayAs || item?.title || 'Untitled'
      }`}</div>
      <div className="text-md">{`${item?.artist || ''}`}</div>
    </div>
  )
}

export default Title
