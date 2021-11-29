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
            onClick={() => onChange(index)}
            className={`uppercase px-4 py-1 cursor-pointer ${
              value === index
                ? "text-primary hover:text-primary-dark border-primary border-b-2 font-bold"
                : "text-secondary hover:text-secondary-dark border-secondary"
            }`}
          >
            {val}
          </div>
        ))}
      </div>
    </div>
  );
}
