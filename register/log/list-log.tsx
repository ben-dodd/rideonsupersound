import { LogObject } from "@/lib/types";
import { useClerks } from "@/lib/swr-hooks";

type ListItemProps = {
  log: LogObject;
};

export default function ListLog({ log }: ListItemProps) {
  const { clerks } = useClerks();
  return (
    <div className="flex w-full mb-2 border-b border-yellow-100 py-2">
      <div className="flex flex-col sm:flex-row w-full justify-between">
        <div className="flex flex-col sm:flex-row">
          <div className="font-bold pr-4">{log?.date_created}</div>
          <div>{log?.log}</div>
        </div>
        <div className="font-bold">
          {(clerks || []).filter((c) => c?.id === log?.clerk_id)[0]?.name}
        </div>
      </div>
    </div>
  );
}
