import { useState } from "react";
import { useAtom } from "jotai";
import {
  cartAtom,
  clerkAtom,
  showCartAtom,
  showHoldAtom,
  sellSearchBarAtom,
  showCreateContactAtom,
} from "@/lib/atoms";
import { CartItem, ContactObject } from "@/lib/types";
import TextField from "@/components/inputs/text-field";
import CreateableSelect from "@/components/inputs/createable-select";
import ListItem from "./list-item";
import { useContacts } from "@/lib/swr-hooks";

export default function SaleSummary() {
  const [cart, setCart] = useAtom(cartAtom);
  const [, setCreateContactScreen] = useAtom(showCreateContactAtom);
  const [, setShowCart] = useAtom(showCartAtom);
  const [, setShowHold] = useAtom(showHoldAtom);
  const [, setSearch] = useAtom(sellSearchBarAtom);
  const [clerk] = useAtom(clerkAtom);
  const { contacts } = useContacts();
  const [holdPeriod, setHoldPeriod] = useState(30);
  const [note, setNote] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="flex flex-col justify-between h-menu px-2 bg-blue-200 text-black">
      Sale Summary
    </div>
  );
}
