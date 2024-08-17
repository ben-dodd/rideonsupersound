interface TabProps {
  tabs: string[]
  value: number
  onChange: Function
}

export default function Tabs({ tabs, value, onChange }: TabProps) {
  return (
    <div className="flex">
      <div className="flex justify-between pb-2">
        {tabs?.map((val, index) => (
          <div
            key={index}
            onClick={() => onChange(index)}
            className={`uppercase px-4 py-1 cursor-pointer italic shadow-xs hover:shadow-md ${
              value === index
                ? `text-black hover:text-gray-800 border-orange-800 border-b-8 font-black hover:border-orange-600 shadow-lg`
                : 'text-gray-500 hover:text-gray-600 hover:bg-orange-100 border border-r font-bold'
            } ${
              index === 0
                ? 'rounded-tl-md rounded-bl-md'
                : index === tabs?.length - 1
                ? 'rounded-tr-md rounded-br-md'
                : ''
            }`}
          >
            {val}
          </div>
        ))}
      </div>
    </div>
  )
}
