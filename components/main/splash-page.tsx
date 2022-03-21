import Head from "next/head";
import SignOutButton from "@/components/_components/button/sign-out-button";

import { bg, bgDark, bgLight, ClerkObject } from "@/lib/types";
import { clerkAtom } from "@/lib/atoms";
import { useAtom } from "jotai";
import { saveLog } from "@/lib/db-functions";
import { useLogs } from "@/lib/swr-hooks";

export default function SplashPage({ clerks }) {
  const { logs, mutateLogs } = useLogs();
  const [, setClerk] = useAtom(clerkAtom);

  return (
    <>
      <Head>
        <title>CHOOSE YOUR FIGHTER - R.O.S.S.</title>
      </Head>
      <div className="bg-black h-screen">
        <div className="flex flex-col sm:h-full mx-auto">
          <div className="p-8 text-center text-xl font-bold text-white">
            CHOOSE YOUR FIGHTER
          </div>
          <div>
            {clerks?.map((c: ClerkObject) => (
              <div
                key={c?.id}
                className={`${bgLight[c?.colour || 9]} hover:${
                  bg[c?.colour || 9]
                } text-center py-4 cursor-pointer font-bold text-lg`}
                onClick={() => {
                  setClerk(c);
                  saveLog(
                    {
                      log: `${c.name} set as clerk.`,
                      clerk_id: c?.id,
                    },
                    logs,
                    mutateLogs
                  );
                }}
              >
                {c?.name?.toUpperCase()}
              </div>
            ))}
          </div>
          {/* <div className="grid md:grid-cols-3 gap-8 place-items-center align-center mb-8">
            {clerks?.map((c: ClerkObject) => (
              <Clerk key={c?.id} clerk={c} />
            ))}
          </div> */}
          <SignOutButton />
        </div>
      </div>
    </>
  );
}
