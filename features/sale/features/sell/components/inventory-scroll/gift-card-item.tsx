import { useAtom } from 'jotai'

import { viewAtom } from '@lib/atoms'

import AddIcon from '@mui/icons-material/Add'

export default function GiftCardItem() {
  const [view, setView] = useAtom(viewAtom)
  return (
    <div className="flex justify-between w-full mb-2 bg-blue-100">
      <div className="flex">
        <div className="w-32">
          <div className="w-32 h-32 relative">
            <img
              className="object-cover absolute"
              src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/giftCard.png`}
              alt={'Gift Card'}
            />
          </div>
        </div>
        <div className="ml-2">
          <div className="font-bold">GIFT CARD</div>
          <div className="text-xs">Click to create new gift card</div>
        </div>
      </div>
      <div className="self-center px-2 hidden sm:inline">
        <button
          className="icon-button-large"
          onClick={() => setView({ ...view, giftCardDialog: true })}
        >
          <AddIcon style={{ fontSize: '40px' }} />
        </button>
      </div>
    </div>
  )
}
