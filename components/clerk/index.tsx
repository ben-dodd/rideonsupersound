// Packages
import { useAtom } from "jotai";

// DB
import { useLogs } from "@/lib/swr-hooks";
import { clerkAtom } from "@/lib/atoms";

// Functions
import { saveLog } from "@/lib/db-functions";

// Components
import Image from "next/image";
import Skeleton from "react-loading-skeleton";

export default function Clerk({ clerk }) {
  // SWR
  const { logs, mutateLogs } = useLogs();

  // Atoms
  const [, setClerk] = useAtom(clerkAtom);

  // Constants
  // REVIEW Check if clerk image needs loading skeleton
  const isLoading = false;

  return clerk && !isLoading ? (
    <button
      onClick={() => {
        setClerk(clerk);
        saveLog(
          {
            log: `${clerk.name} set as clerk.`,
            clerk_id: clerk?.id,
          },
          logs,
          mutateLogs
        );
      }}
    >
      <div className="relative bg-white cursor-pointer w-full shadow-md rounded-full transform hover:scale-105 hover:shadow-2xl">
        <Image
          src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/clerk/${
            clerk?.name || "Guest"
          }.png`}
          alt={clerk?.name}
          height={200}
          width={200}
        />
      </div>
    </button>
  ) : (
    <Skeleton circle={true} height={200} width={200} />
  );
}

// How to do images in the DB
// var arrayBufferView = new Uint8Array(image?.data);
// var blob = new Blob([arrayBufferView], { type: "image/png" });
// src={`${image ? URL.createObjectURL(blob) : "/clerk/guest.png"}`}
