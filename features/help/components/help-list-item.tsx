import { HelpObject } from '../lib/types'

type HelpListItemProps = {
  help: HelpObject
  setHelp: Function
}
export default function HelpListItem({ help, setHelp }: HelpListItemProps) {
  return (
    <div
      className="w-full text-black p-2 my-2 hover:bg-gray-200 cursor-pointer"
      onClick={() => setHelp(help)}
    >
      <div className="text-2xl">{help?.title}</div>
    </div>
  )
}
