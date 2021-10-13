import { MouseEventHandler } from "react";
import ModalBase from "@/components/container/modal/base";
import { ModalButton } from "@/lib/types";
import CircularProgress from "@mui/material/CircularProgress";
import CloseButton from "@/components/button/close-button";

interface ModalProps {
  open: boolean;
  closeFunction: MouseEventHandler<HTMLButtonElement>;
  disableBackdropClick?: boolean;
  title?: string;
  buttons?: ModalButton[];
  children: JSX.Element;
}

export default function Modal({
  open,
  closeFunction,
  disableBackdropClick,
  title,
  buttons,
  children,
}: ModalProps) {
  return (
    <ModalBase
      open={open}
      onClose={closeFunction}
      disableBackdropClick={disableBackdropClick}
    >
      {closeFunction && <CloseButton closeFunction={closeFunction} />}
      {title && <div className="modal__title">{title}</div>}
      <div className="modal__body">{children}</div>
      {buttons && (
        <div className={`modal__button-div`}>
          {buttons.map((button: ModalButton) => (
            <button
              className={`modal__button--${button?.type} ${
                button?.hidden ? " hidden" : ""
              }`}
              onClick={() => button?.onClick()}
              disabled={button?.disabled || button?.loading}
            >
              {button?.loading ? (
                <span className="pr-4">
                  <CircularProgress color="inherit" thickness={5} size={18} />
                </span>
              ) : (
                <span />
              )}
              {button?.text}
            </button>
          ))}
        </div>
      )}
    </ModalBase>
  );
}
