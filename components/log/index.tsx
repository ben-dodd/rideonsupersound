// Packages
import { useAtom } from "jotai";

// DB
import { useLogs } from "@/lib/swr-hooks";
import { pageAtom } from "@/lib/atoms";
import { LogObject } from "@/lib/types";

// Components
import ListLog from "./list-log";

export default function LogScreen() {
  // SWR
  const { logs, isLogsLoading } = useLogs();

  // Atoms
  const [page] = useAtom(pageAtom);

  return (
    <div
      className={`flex flex-col overflow-x-hidden ${
        page !== "logs" ? "hidden" : ""
      }`}
    >
      <div className="bg-col9 text-4xl font-bold uppercase text-white p-2 mb-1">
        Logs
      </div>
      <div className="h-menu w-full overflow-y-scroll px-2 bg-white">
        {isLogsLoading ? (
          <div className="w-full flex h-full">
            <div className="loading-icon" />
          </div>
        ) : (
          logs?.map((log: LogObject) => <ListLog log={log} key={log?.id} />)
        )}
      </div>
    </div>
  );
}
