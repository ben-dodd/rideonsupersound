// DB
import { useInventory } from '@/lib/swr-hooks'

// Components
import ListItem from './list-item'
import MidScreenContainer from '@/components/_components/container/mid-screen'

export default function List() {
  // SWR
  const { inventory, isInventoryLoading } = useInventory()

  return (
    <MidScreenContainer
      title={'Inventory'}
      titleClass={'bg-col2'}
      isLoading={isInventoryLoading}
    >
      {inventory
        ?.filter((i) => i?.quantity > 0)
        ?.slice(0, 50)
        ?.map((i) => (
          <ListItem key={i?.id} item={i} />
        ))}
    </MidScreenContainer>
  )
}
