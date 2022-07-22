// Icons
import CloseIcon from "@mui/icons-material/Close";

// Types
import { MouseEventHandler } from "react";
interface CloseButtonProps {
  closeFunction: MouseEventHandler<HTMLButtonElement>;
}

export default function CloseButton({ closeFunction }: CloseButtonProps) {
  return (
    <div className="modal__close-button-div">
      <button className="modal__close-button" onClick={closeFunction}>
        <CloseIcon />
      </button>
    </div>
  );
}
