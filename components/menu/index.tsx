import { useAtom } from "jotai";
import { pageAtom, cartAtom, clerkAtom, menuDisplayAtom } from "@/lib/atoms";
import { SaleItemObject } from "@/lib/types";

// Change to lazy loading
import ContactsIcon from "@material-ui/icons/LocalLibrary";
// import HoldsIcon from "@material-ui/icons/PanTool";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import InventoryIcon from "@material-ui/icons/Category";
// import LaybyIcon from "@material-ui/icons/ShoppingBasket";
import LogoutIcon from "@material-ui/icons/ExitToApp";
// import OrdersIcon from "@material-ui/icons/Flight";
import SalesIcon from "@material-ui/icons/MonetizationOn";
import SellIcon from "@material-ui/icons/LocalAtm";
// import SettingsIcon from "@material-ui/icons/Settings";
import LogsIcon from "@material-ui/icons/GridOn";
// import StaffIcon from "@material-ui/icons/ChildCare";
// import AnalyticsIcon from "@material-ui/icons/PieChart";
// import StocktakeIcon from "@material-ui/icons/Storage";
// import TasksIcon from "@material-ui/icons/PlaylistAddCheck";
import VendorsIcon from "@material-ui/icons/Store";
// import SuppliersIcon from "@material-ui/icons/LocalShipping";
import PaymentsIcon from "@material-ui/icons/Receipt";
import GiftCardsIcon from "@material-ui/icons/Redeem";
// import LampRepairIcon from "@material-ui/icons/EmojiObjects";
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
  const [cart] = useAtom(cartAtom);
  const [page, setPage] = useAtom(pageAtom);
  const [menuDisplay, setMenuDisplay] = useAtom(menuDisplayAtom);
  const [, setClerk] = useAtom(clerkAtom);
  const cartItems = (cart?.items || []).reduce(
    (accumulator: number, item: SaleItemObject) =>
      accumulator + (parseInt(item?.quantity) || 1),
    0
  );
  const menu = [
    [
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
      // {
      //   type: "link",
      //   page: "laybys",
      //   text: "LAYBYS and HOLDS",
      //   icon: <LaybyIcon />,
      // },
      // { type: "link", page: "holds", text: "HOLDS", icon: <HoldsIcon /> },
      // { type: "divider" },
      {
        type: "link",
        page: "vendors",
        text: "VENDORS",
        class: "bg-col3-light hover:bg-col3",
        icon: <VendorsIcon />,
      },
      {
        type: "link",
        page: "contacts",
        text: "CONTACTS",
        class: "bg-col4-light hover:bg-col4",
        icon: <ContactsIcon />,
      },
      // {
      //   type: "link",
      //   page: "orders",
      //   text: "ORDERS",
      //   color: "col5",
      //   icon: <OrdersIcon />,
      // },
      {
        type: "link",
        page: "giftcards",
        text: "GIFT CARDS",
        class: "bg-col5-light hover:bg-col5",
        icon: <GiftCardsIcon />,
      },
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
      {
        type: "link",
        page: "sales",
        text: "SALES",
        class: "bg-col7-light hover:bg-col7",
        icon: <SalesIcon />,
      },
      {
        type: "link",
        page: "transactions",
        text: "PAYMENTS",
        class: "bg-col8-light hover:bg-col8",
        icon: <PaymentsIcon />,
      },
      // {
      //   type: "link",
      //   page: "tasks",
      //   text: "TASKS",
      //   badge: tasksToDo,
      //   icon: <TasksIcon />,
      // },
    ],
    [
      {
        type: "link",
        page: "logs",
        text: "LOGS",
        class: "bg-col8-light hover:bg-col8",
        icon: <LogsIcon />,
      },
      {
        type: "link",
        page: "importExport",
        text: "IMPORT/EXPORT",
        class: "bg-col9-light hover:bg-col9",
        icon: <ImportExportIcon />,
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
        class: "bg-col10-light hover:bg-col10",
        icon: <LogoutIcon />,
      },
    ],
  ];

  return (
    <div
      className={`w-0 overflow-y-auto flex flex-col h-menu justify-between bg-white z-50 flex-shrink-0 whitespace-pre relative ${
        menuDisplay && "w-full "
      }sm:w-full sm:w-icons sm:border-r sm:shadow-lg lg:w-1/6 transition-width duration-200 `}
    >
      {menu?.map((list, i) => (
        <ul key={i}>
          {list?.map((item: MenuType, i: number) =>
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
                        setMenuDisplay(false);
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
      ))}
    </div>
  );
}
