import ContactTable from "./contact-table";
import ContactScreen from "./contact-screen";
import { useAtom } from "jotai";
import { pageAtom } from "@/lib/atoms";

export default function Contact() {
  const [page] = useAtom(pageAtom);
  return (
    <div
      className={`flex relative overflow-x-hidden ${
        page !== "contacts" ? "hidden" : ""
      }`}
    >
      <ContactTable />
    </div>
  );
}
