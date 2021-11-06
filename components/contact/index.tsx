// Packages
import { useAtom } from "jotai";

// DB
import { pageAtom } from "@/lib/atoms";

// Components
import ContactTable from "./contact-table";
import ContactScreen from "./contact-screen";

// REVIEW add contact-screen

export default function Contact() {
  // Atoms
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
