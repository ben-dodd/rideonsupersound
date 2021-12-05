// Packages
import { useState, useCallback } from "react";
import { useAtom } from "jotai";
import { useDropzone } from "react-dropzone";

// DB
import { useJobs, useInventory } from "@/lib/swr-hooks";
import { pageAtom } from "@/lib/atoms";
import { TaskObject, InventoryObject } from "@/lib/types";

import { uploadFiles } from "@/lib/db-functions";

// Components
import ListTask from "./list-task";
import TaskDialog from "./task-dialog";
import RestockTask from "./restock-task";
import Tabs from "@/components/_components/navigation/tabs";

export default function TaskScreen() {
  // SWR
  const { jobs, isJobsLoading } = useJobs();
  const { inventory, isInventoryLoading } = useInventory();

  // Atoms
  const [page] = useAtom(pageAtom);
  const [tab, setTab] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    if (acceptedFiles.length > 1) {
      // setAlert({
      //   message: `IMAGE UPLOAD FAILED. ONLY ONE IMAGE PERMITTED FOR PRODUCT.`,
      //   type: "error",
      // })
    } else {
      let file = acceptedFiles[0];
      if (!file.type.includes("image")) {
        // setAlert({
        //   message: "IMAGE UPLOAD FAILED. FILE NOT AN IMAGE.",
        //   type: "error",
        // })
      } else {
        // uploadFiles({
        //   file,
        //   storagePath: "inventory/",
        //   callback: ({ path, url }) => {
        //     setItem({ ...item, imageRef: path, image: url });
        //   },
      }
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <div
        className={`flex overflow-x-hidden ${page !== "jobs" ? "hidden" : ""}`}
      >
        <div className="h-menu w-full overflow-y-scroll px-2 bg-white">
          <div className="text-2xl mt-4 mb-2 text-black font-mono">Jobs</div>
          <Tabs
            tabs={["Restocking", "Other Jobs", "Test"]}
            value={tab}
            onChange={setTab}
          />
          <div hidden={tab !== 0}>
            {isInventoryLoading ? (
              <div className="w-full flex h-full">
                <div className="loading-icon" />
              </div>
            ) : (
              inventory
                ?.filter((item: InventoryObject) => item?.needs_restock)
                .map((item: InventoryObject) => (
                  <RestockTask item={item} key={item?.id} />
                ))
            )}
          </div>
          <div hidden={tab !== 1}>
            {isJobsLoading ? (
              <div className="w-full flex h-full">
                <div className="loading-icon" />
              </div>
            ) : (
              jobs?.map((task: TaskObject) => (
                <ListTask task={task} key={task?.id} />
              ))
            )}
          </div>
          <div hidden={tab !== 2}>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <TaskDialog />
    </>
  );
}
