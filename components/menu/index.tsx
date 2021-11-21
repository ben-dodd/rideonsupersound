// Packages
import { useAtom } from "jotai";
import Image from "next/image";

// DB
import { useTasks } from "@/lib/swr-hooks";
import { pageAtom, newSaleObjectAtom, clerkAtom, viewAtom } from "@/lib/atoms";
import { SaleItemObject, TaskObject } from "@/lib/types";

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
import TasksIcon from "@mui/icons-material/Task";
import StatsIcon from "@mui/icons-material/QueryStats";

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
  const [cart] = useAtom(newSaleObjectAtom);
  const [page, setPage] = useAtom(pageAtom);
  const [view, setView] = useAtom(viewAtom);
  const [clerk, setClerk] = useAtom(clerkAtom);

  // SWR
  const { tasks } = useTasks();

  // Constants
  const cartItems = cart?.items?.reduce(
    (accumulator: number, item: SaleItemObject) =>
      accumulator + (parseInt(item?.quantity) || 1),
    0
  );

  const tasksToDo = tasks?.filter(
    (t: TaskObject) => !t?.is_deleted && !t?.is_completed
  )?.length;

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
      text: "SALES/LAYBYS",
      class: "bg-col5-light hover:bg-col5",
      icon: <SalesIcon />,
    },
    {
      type: "link",
      page: "customers",
      text: "HOLDS",
      class: "bg-col6-light hover:bg-col6",
      icon: <HoldsIcon />,
    },
    {
      type: "link",
      page: "giftCards",
      text: "GIFT CARDS",
      class: "bg-col7-light hover:bg-col7",
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
      class: "bg-col8-light hover:bg-col8",
      icon: <LogsIcon />,
    },
    {
      type: "link",
      page: "tasks",
      text: "TASKS",
      badge: tasksToDo,
      class: "bg-col9-light hover:bg-col9",
      icon: <TasksIcon />,
    },
    {
      type: "link",
      page: "stats",
      text: "STATS",
      class: "bg-col10-light hover:bg-col10",
      icon: <StatsIcon />,
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
      class: "bg-col1-light hover:bg-col1",
      icon: <LogoutIcon />,
    },
  ];

  const bg = {
    nick: "bg-nick",
    mieke: "bg-mieke",
    john: "bg-john",
    michael: "bg-michael",
    guest: "bg-guest",
    isaac: "bg-isaac",
  };

  return (
    <div
      className={`w-0 overflow-y-auto flex flex-col h-menu justify-between ${
        bg[clerk?.name?.toLowerCase()]
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
      <div className="hover:animate-ping">
        <Image
          src={`${process.env.NEXT_PUBLIC_RESOURCE_URL}img/clerk/${clerk?.name}.png`}
          alt={clerk?.name}
          width={200}
          height={200}
        />
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
