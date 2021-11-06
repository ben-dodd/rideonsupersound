// Components
import ModalBase from "@/components/container/modal/base";
import CircularProgress from "@mui/material/CircularProgress";
import CloseButton from "@/components/button/close-button";

// Types
import { MouseEventHandler } from "react";
import { ModalButton } from "@/lib/types";

interface ModalProps {
  open: boolean;
  closeFunction: MouseEventHandler<HTMLButtonElement>;
  disableBackdropClick?: boolean;
  title?: string;
  buttons?: ModalButton[];
  loading?: boolean;
  width?: string;
  children: JSX.Element;
}

export default function Modal({
  open,
  closeFunction,
  disableBackdropClick,
  title,
  buttons,
  loading = false,
  width = "md",
  children,
}: ModalProps) {
  return (
    <ModalBase
      open={open}
      onClose={closeFunction}
      disableBackdropClick={disableBackdropClick}
      width={width}
    >
      {closeFunction && <CloseButton closeFunction={closeFunction} />}
      {title && <div className="modal__title">{title}</div>}
      <div className="modal__body">
        {loading ? (
          <div className="loading-screen max-h-dialog">
            <div className="loading-icon" />
          </div>
        ) : (
          children
        )}
      </div>
      {buttons && (
        <div className={`modal__button-div`}>
          {buttons.map((button: ModalButton, i: number) => (
            <button
              key={i}
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
