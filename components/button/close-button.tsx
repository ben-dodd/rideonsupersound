import { MouseEventHandler } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface CloseButtonProps {
  closeFunction: MouseEventHandler<HTMLButtonElement>;
}

export default function CloseButton({ closeFunction }: CloseButtonProps) {
  return (
    <div className="flex justify-end">
      <button
        className="p-2 text-gray-800 hover:text-gray-500 outline-none border-none"
        onClick={closeFunction}
      >
        <CloseIcon />
      </button>
    </div>
  );
}
