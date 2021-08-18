import { useAtom } from "jotai";
import { clerkAtom, pageAtom, menuDisplayAtom } from "@/lib/atoms";
import { useClerkImage } from "@/lib/swr-hooks";

import Hamburger from "@/components/icon/hamburger";

export default function Nav() {
  const [clerk] = useAtom(clerkAtom);
  const [menuDisplay, setMenuDisplay] = useAtom(menuDisplayAtom);
  const [page] = useAtom(pageAtom);
  const { image } = useClerkImage(clerk?.image_id);

  var arrayBufferView = new Uint8Array(image?.data);
  var blob = new Blob([arrayBufferView], { type: "image/png" });

  return (
    <nav className="py-2 bg-black text-white h-nav">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img
            className="bg-white rounded-full mx-2"
            src={`${image ? URL.createObjectURL(blob) : "/clerk/guest.png"}`}
            alt={clerk?.name}
            height={50}
            width={50}
          />
          <div>
            <div className="sm:hidden">{`${clerk?.name?.toUpperCase()} @ R.O.S.S.`}</div>
            <div className="hidden sm:block">{`${clerk?.name?.toUpperCase()} @ RIDE ON SUPER SOUND`}</div>
            <div>{page?.toUpperCase()}</div>
          </div>
        </div>
        <button
          className="px-4 sm:hidden"
          onClick={() => setMenuDisplay(!menuDisplay)}
        >
          <Hamburger />
        </button>
      </div>
    </nav>
  );
}
