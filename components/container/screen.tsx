import { MouseEventHandler } from "react";
import { ModalButton } from "@/lib/types";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import { CSVLink } from "react-csv";

interface ScreenProps {
  show: boolean;
  closeFunction: MouseEventHandler<HTMLButtonElement>;
  title?: string;
  loading?: boolean;
  buttons?: ModalButton[];
  children: JSX.Element;
}

export default function ScreenContainer({
  show,
  closeFunction,
  title,
  loading,
  buttons,
  children,
}: ScreenProps) {
  return (
    <div
      className={`absolute top-0 transition-offset duration-300 ${
        show ? "left-0" : "left-full"
      } h-full w-full bg-yellow-200`}
    >
      {loading ? (
        <div className="loading-screen">
          <div className="loading-icon" />
        </div>
      ) : (
        <div className="screen__content">
          <div className="screen__title">
            <button className="screen__back-button" onClick={closeFunction}>
              <ChevronLeft />
            </button>
            {title}
          </div>
          <div className="screen__body">{children}</div>
          {buttons && (
            <div className="screen__button-div">
              {buttons.map((button: ModalButton) =>
                button?.type === "div" ? (
                  <div />
                ) : button?.data && !button?.disabled ? (
                  <CSVLink
                    className={`screen__button--${button?.type}`}
                    data={button?.data}
                    headers={button?.headers}
                    filename={button?.fileName}
                    onClick={() => button?.onClick()}
                  >
                    {button?.text}
                  </CSVLink>
                ) : (
                  <button
                    className={`screen__button--${button?.type}`}
                    onClick={() => button?.onClick()}
                    disabled={button?.disabled}
                  >
                    {button?.text}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
