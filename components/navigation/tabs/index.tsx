interface TabProps {
  tabs: string[]
  icons?: any[]
  value: number
  onChange: Function
}

export default function Tabs({ tabs, icons, value, onChange }: TabProps) {
  return tabs ? (
    <div className="flex w-50 pt-2">
      <div className="flex justify-between pb-2">
        {tabs?.map((val, index) => (
          <div
            onClick={() => onChange(index)}
            className={`flex align-center uppercase px-4 py-1 cursor-pointer text-sm ${
              value === index
                ? `text-green-500 hover:text-green-600 border-green-500 hover:border-green-600 border-b-2 font-bold`
                : 'text-gray-500 hover:text-gray-600 border-gray-500'
            }`}
            key={index}
          >
            {icons && <div className="mr-2">{icons[index]}</div>}
            <div>{val}</div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div />
  )
}
