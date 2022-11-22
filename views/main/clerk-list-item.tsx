import { saveLog } from 'features/log/lib/functions'
import { clerkAtom } from 'lib/atoms'
import { bg, bgLight } from 'lib/types'
import { useAtom } from 'jotai'

export default function ClerkListItem(clerk) {
  const [, setClerk] = useAtom(clerkAtom)
  return (
    <div
      key={clerk?.id}
      className={`${bgLight[clerk?.colour || 9]} hover:${
        bg[clerk?.colour || 9]
      } text-center py-4 cursor-pointer font-bold text-lg`}
      onClick={() => {
        setClerk(clerk)
        saveLog(`${clerk.name} set as clerk.`, clerk?.id)
      }}
    >
      {clerk?.name?.toUpperCase()}
    </div>
  )
}
