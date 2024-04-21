import { getItemSkuDisplayName } from 'lib/functions/displayInventory'

const Title = ({ item }) => {
  return <div className="font-bold text-md">{getItemSkuDisplayName(item)}</div>
}

export default Title
