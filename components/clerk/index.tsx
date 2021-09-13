import { useAtom } from "jotai";
// import { useUpdateAtom } from "jotai/utils";
import { clerkAtom } from "@/lib/atoms";
import { useClerkImage } from "@/lib/swr-hooks";

import Skeleton from "react-loading-skeleton";

function Clerk({ clerk }) {
  const [, setClerk] = useAtom(clerkAtom);
  // const setClerk = useUpdateAtom(clerkAtom);

  // const { image, isLoading } = useClerkImage(clerk?.image_id);
  const isLoading = false;
  //
  // var arrayBufferView = new Uint8Array(image?.data);
  // var blob = new Blob([arrayBufferView], { type: "image/png" });

  return clerk && !isLoading ? (
    <button onClick={() => setClerk(clerk)}>
      <img
        className="bg-white cursor-pointer w-full shadow-md rounded-full transform hover:scale-105 hover:shadow-2xl"
        // src={`${image ? URL.createObjectURL(blob) : "/clerk/guest.png"}`}
        src={clerk?.name ? `/clerk/${clerk.name}.png` : "/clerk/guest.png"}
        alt={clerk?.name}
        height={200}
        width={200}
      />
    </button>
  ) : (
    <Skeleton circle={true} height={200} width={200} />
  );
}

export default Clerk;
