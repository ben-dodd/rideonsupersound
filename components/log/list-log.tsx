import { LogObject, ClerkObject } from "@/lib/types";
import { useClerks } from "@/lib/swr-hooks";

type ListItemProps = {
  log: LogObject;
};

export default function ListLog({ log }: ListItemProps) {
  const { clerks } = useClerks();
  return (
    <div className="flex w-full border-b border-yellow-100 py-1 font-mono text-xs text-white">
      <div className="flex flex-col sm:flex-row w-full justify-between">
        <div className="flex flex-col sm:flex-row">
          <div className="font-bold pr-4 text-pink-600">
            {log?.date_created}
          </div>
          <div className="font-bold w-16 text-blue-800">
            {
              (clerks || []).filter(
                (c: ClerkObject) => c?.id === log?.clerk_id
              )[0]?.name
            }
          </div>
          <div>{log?.log}</div>
        </div>
      </div>
    </div>
  );
}
