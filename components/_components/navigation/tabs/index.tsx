interface TabProps {
  tabs: string[];
  value: number;
  onChange: Function;
}

export default function Tabs({ tabs, value, onChange }: TabProps) {
  return (
    <div className="flex w-50">
      <div className="flex justify-between pb-2">
        {tabs?.map((val, index) => (
          <div
            key={index}
            onClick={() => onChange(index)}
            className={`uppercase px-4 py-1 cursor-pointer ${
              value === index
                ? `text-black hover:text-gray-800 border-black border-b-2 font-bold`
                : "text-gray-500 hover:text-gray-600 border-gray-500"
            }`}
          >
            {val}
          </div>
        ))}
      </div>
    </div>
  );
}
