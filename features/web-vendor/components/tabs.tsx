interface TabProps {
  tabs: string[];
  value: number;
  onChange: Function;
}

export default function Tabs({ tabs, value, onChange }: TabProps) {
  return (
    <div className="flex">
      <div className="flex justify-between pb-2">
        {tabs?.map((val, index) => (
          <div
            key={index}
            onClick={() => onChange(index)}
            className={`uppercase px-4 py-1 cursor-pointer italic ${
              value === index
                ? `text-black hover:text-gray-800 border-orange-800 border-b-8 font-black `
                : "text-gray-500 hover:text-gray-600 font-bold"
            }`}
          >
            {val}
          </div>
        ))}
      </div>
    </div>
  );
}
