import { useAtom } from "jotai";
import { clerkAtom, pageAtom, menuDisplayAtom } from "@/lib/atoms";
import { useClerkImage } from "@/lib/swr-hooks";
import { getImageSrc } from "@/lib/data-functions";
import Image from "next/image";

import Hamburger from "@/components/icon/hamburger";

export default function Nav() {
  const [clerk] = useAtom(clerkAtom);
  const [menuDisplay, setMenuDisplay] = useAtom(menuDisplayAtom);
  // const [page] = useAtom(pageAtom);
  // const { image } = useClerkImage(clerk?.image_id);

  // var arrayBufferView = new Uint8Array(image?.data);
  // var blob = new Blob([arrayBufferView], { type: "image/png" });

  return (
    <nav className="py-2 bg-white text-black h-nav">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-12">
            <div className="w-12 h-12 bg-black rounded-full mx-2 relative">
              <Image
                layout="fill"
                objectFit="cover"
                src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/clerk/${clerk?.name}.png`}
                alt={clerk?.name}
              />
            </div>
          </div>
          <div className="ml-8">
            {/*<div className="sm:hidden">{`${clerk?.name?.toUpperCase()} @ R.O.S.S.`}</div>
            <div className="hidden sm:block">{`${clerk?.name?.toUpperCase()} @ RIDE ON SUPER SOUND`}</div>*/}
            <Image
              src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/ross-banner.png`}
              alt="Ride On Super Sound"
              height="41px"
              width="283px"
            />
            {/*<div>{page?.toUpperCase()}</div>*/}
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

// <div
// className="bg-white rounded-full mx-2">
// <Image
//
//   layout="fill"
//   src={`${image ? URL.createObjectURL(blob) : "/clerk/guest.png"}`}
//   alt={clerk?.name}
// /></div>
