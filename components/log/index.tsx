import { useLogs } from "@/lib/swr-hooks";
import { LogObject } from "@/lib/types";
import ListLog from "./list-log";
import { useAtom } from "jotai";
import { pageAtom } from "@/lib/atoms";

export default function LogScreen() {
  const { logs, isLogsLoading } = useLogs();
  const [page] = useAtom(pageAtom);

  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "logs" ? "hidden" : ""
      }`}
    >
      <div className="h-menu overflow-y-scroll px-2 bg-black">
        <div className="text-2xl mt-4 mb-2 text-white font-mono">Logs</div>
        {isLogsLoading ? (
          <div className="w-full flex h-full">
            <div className="loading-icon" />
          </div>
        ) : (
          (logs || []).map((log: LogObject) => (
            <ListLog log={log} key={log?.id} />
          ))
        )}
      </div>
    </div>
  );
}
