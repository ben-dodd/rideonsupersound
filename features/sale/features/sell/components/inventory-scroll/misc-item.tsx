import { useAtom } from 'jotai'

import { viewAtom } from 'lib/atoms'

import AddIcon from '@mui/icons-material/Add'

export default function MiscItem() {
  const [view, setView] = useAtom(viewAtom)
  return (
    <div className="flex justify-between w-full mb-2 bg-blue-100">
      <div className="flex">
        <div className="w-32">
          <div className="w-32 h-32 relative">
            <img
              className="object-cover absolute"
              src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/default.png`}
              alt={'Misc Item'}
            />
          </div>
        </div>
        <div className="ml-2">
          <div className="font-bold">MISC ITEM</div>
          <div className="text-xs">
            Click to add a miscellaneous item or payment.
          </div>
        </div>
      </div>
      <div className="self-center px-2 hidden sm:inline">
        <button
          className="icon-button-large"
          onClick={() => setView({ ...view, miscItemDialog: true })}
        >
          <AddIcon style={{ fontSize: '40px' }} />
        </button>
      </div>
    </div>
  )
}
