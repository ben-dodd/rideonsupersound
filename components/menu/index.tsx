// Packages
import { useAtom } from "jotai";
import Image from "next/image";

// DB
import { useJobs, useInventory } from "@/lib/swr-hooks";
import { pageAtom, cartAtom, clerkAtom, viewAtom } from "@/lib/atoms";
import { SaleItemObject, TaskObject, StockObject, bg } from "@/lib/types";

// Icons
// import CustomersIcon from "@mui/icons-material/LocalLibrary";
import HoldsIcon from "@mui/icons-material/PanTool";
import InventoryIcon from "@mui/icons-material/Category";
import LogoutIcon from "@mui/icons-material/ExitToApp";
import SalesIcon from "@mui/icons-material/MonetizationOn";
import SellIcon from "@mui/icons-material/LocalAtm";
import LogsIcon from "@mui/icons-material/GridOn";
import VendorsIcon from "@mui/icons-material/Store";
import PaymentsIcon from "@mui/icons-material/Receipt";
import GiftCardsIcon from "@mui/icons-material/Redeem";
import LaybyIcon from "@mui/icons-material/DryCleaning";
import JobsIcon from "@mui/icons-material/Task";
import StatsIcon from "@mui/icons-material/QueryStats";
import StocktakeIcon from "@mui/icons-material/Numbers";

// Types
type MenuType = {
  type: string;
  page: string;
  text: string;
  badge: any;
  class: string;
  icon: any;
  onClick: any;
};

export default function Menu() {
  // Atoms
  const [cart] = useAtom(cartAtom);
  const [page, setPage] = useAtom(pageAtom);
  const [view, setView] = useAtom(viewAtom);
  const [clerk, setClerk] = useAtom(clerkAtom);

  // SWR
  const { jobs } = useJobs();
  const { inventory } = useInventory();

  // Constants
  const cartItems = cart?.items?.reduce?.(
    (accumulator: number, item: SaleItemObject) =>
      accumulator + (parseInt(item?.quantity) || 1),
    0
  );

  console.log(inventory);
  const jobsToDo =
    (jobs?.filter?.((t: TaskObject) => !t?.is_deleted && !t?.is_completed)
      ?.length || 0) +
    (inventory?.filter?.((i: StockObject) => i?.needs_restock)?.length || 0);

  const topMenu = [
    {
      type: "link",
      page: "sell",
      // badge: openSales,
      text: "SELL",
      badge: cartItems,
      class: "bg-col1-light hover:bg-col1",
      // icon: <InventoryIcon />,
      icon: <SellIcon />,
    },
    {
      type: "link",
      page: "inventory",
      text: "INVENTORY",
      class: "bg-col2-light hover:bg-col2",
      icon: <InventoryIcon />,
    },
    {
      type: "link",
      page: "vendors",
      text: "VENDORS",
      class: "bg-col3-light hover:bg-col3",
      icon: <VendorsIcon />,
    },
    {
      type: "link",
      page: "payments",
      text: "PAYMENTS",
      class: "bg-col4-light hover:bg-col4",
      icon: <PaymentsIcon />,
    },
    {
      type: "link",
      page: "sales",
      text: "SALES",
      class: "bg-col5-light hover:bg-col5",
      icon: <SalesIcon />,
    },
    {
      type: "link",
      page: "laybys",
      text: "LAYBYS",
      class: "bg-col6-light hover:bg-col6",
      icon: <LaybyIcon />,
    },
    {
      type: "link",
      page: "holds",
      text: "HOLDS",
      class: "bg-col7-light hover:bg-col7",
      icon: <HoldsIcon />,
    },
    {
      type: "link",
      page: "giftCards",
      text: "GIFT CARDS",
      class: "bg-col8-light hover:bg-col8",
      icon: <GiftCardsIcon />,
    },
    // {
    //   type: "link",
    //   page: "orders",
    //   text: "ORDERS",
    //   color: "col5",
    //   icon: <OrdersIcon />,
    // },
    // {
    //   type: "link",
    //   page: "suppliers",
    //   text: "SUPPLIERS",
    //   color: "col7",
    //   icon: <SuppliersIcon />,
    // },
    // {
    //   type: "link",
    //   page: "staff",
    //   text: "STAFF",
    //   class: "bg-col6-light hover:bg-col6",
    //   icon: <StaffIcon />,
    // },
    // { type: "divider" },
  ];
  const bottomMenu = [
    {
      type: "link",
      page: "logs",
      text: "LOGS",
      class: "bg-col9-light hover:bg-col9",
      icon: <LogsIcon />,
    },
    {
      type: "link",
      page: "jobs",
      text: "JOBS",
      badge: jobsToDo,
      class: "bg-col10-light hover:bg-col10",
      icon: <JobsIcon />,
    },
    // {
    //   type: "link",
    //   page: "stats",
    //   text: "STATS",
    //   class: "bg-col1-light hover:bg-col1",
    //   icon: <StatsIcon />,
    // },
    {
      type: "link",
      page: "stocktake",
      text: "STOCKTAKE",
      class: "bg-col1-light hover:bg-col1",
      icon: <StocktakeIcon />,
    },
    // {
    //   type: "link",
    //   page: "settings",
    //   text: "SETTINGS",
    //   color: "col2",
    //   icon: <SettingsIcon />,
    // },
    {
      type: "link",
      page: null,
      onClick: () => setClerk(null),
      text: "SWITCH CLERK",
      class: "bg-col2-light hover:bg-col2",
      icon: <LogoutIcon />,
    },
  ];

  return (
    <div
      className={`w-0 overflow-y-auto flex flex-col h-menu justify-between ${
        bg[clerk?.colour]
      } z-50 flex-shrink-0 whitespace-pre relative ${
        view?.mainMenu && "w-full "
      }sm:w-full sm:w-icons sm:border-r lg:w-menu transition-width duration-200 `}
    >
      <ul>
        {topMenu?.map((item: MenuType, i: number) =>
          item?.type === "divider" ? (
            <hr key={i} />
          ) : (
            <li
              key={i}
              className={`flex cursor-pointer content-center p-2 py-3 ${
                page === item?.page
                  ? "text-white hover:bg-black bg-black"
                  : item?.class || ""
              }`}
              onClick={
                item?.onClick
                  ? item?.onClick
                  : () => {
                      window.scrollTo(0, 0);
                      setPage(item?.page);
                      setView({ ...view, mainMenu: false });
                    }
              }
            >
              <div className="pr-6">
                {item?.badge ? (
                  <div className="relative">
                    {item?.icon}
                    <div className="flex justify-center items-center absolute -top-1 -right-2 h-5 w-5 bg-green-400 text-white text-xs rounded-full">
                      {item?.badge}
                    </div>
                  </div>
                ) : (
                  item?.icon
                )}
              </div>
              <div>{item?.text}</div>
            </li>
          )
        )}
      </ul>
      <div className="px-8">
        <div className="hover:animate-wiggle">
          {/*src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/clerk/${clerk?.name}.png`}*/}
          <Image
            src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/pyramid.png`}
            alt="Ride On Super Sound"
            width={500}
            height={530}
          />
        </div>
      </div>
      <ul>
        {bottomMenu?.map((item: MenuType, i: number) =>
          item?.type === "divider" ? (
            <hr key={i} />
          ) : (
            <li
              key={i}
              className={`flex cursor-pointer content-center p-2 py-3 ${
                page === item?.page
                  ? "text-white hover:bg-black bg-black"
                  : item?.class || ""
              }`}
              onClick={
                item?.onClick
                  ? item?.onClick
                  : () => {
                      window.scrollTo(0, 0);
                      setPage(item?.page);
                      setView({ ...view, mainMenu: false });
                    }
              }
            >
              <div className="pr-6">
                {item?.badge ? (
                  <div className="relative">
                    {item?.icon}
                    <div className="flex justify-center items-center absolute -top-1 -right-2 h-5 w-5 bg-green-400 text-white text-xs rounded-full">
                      {item?.badge}
                    </div>
                  </div>
                ) : (
                  item?.icon
                )}
              </div>
              <div>{item?.text}</div>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
