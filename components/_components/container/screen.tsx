// DB
import { ModalButton } from "@/lib/types";

// Icons
import ArrowLeft from "@mui/icons-material/ArrowLeft";

// Components
import { CSVLink } from "react-csv";

// Types
import { MouseEventHandler } from "react";
import CircularProgress from "@mui/material/CircularProgress";
interface ScreenProps {
  show: boolean;
  closeFunction: MouseEventHandler<HTMLButtonElement>;
  title?: string;
  loading?: boolean;
  buttons?: ModalButton[];
  titleClass?: string;
  children: JSX.Element;
}

export default function ScreenContainer({
  show,
  closeFunction,
  title,
  loading,
  buttons,
  titleClass,
  children,
}: ScreenProps) {
  return (
    <div
      className={`absolute top-0 transition-offset duration-300 ${
        show ? "left-0" : "left-full hidden"
      } h-full w-full bg-yellow-200`}
    >
      {loading ? (
        <div className="loading-screen">
          <div className="loading-icon" />
        </div>
      ) : (
        <div className="screen__content">
          <div
            className={`screen__title ${
              titleClass ? titleClass : "bg-primary-light"
            }`}
          >
            <button className="screen__back-button" onClick={closeFunction}>
              <ArrowLeft />
            </button>
            {title}
          </div>
          <div className="screen__body">{children}</div>
          {buttons && (
            <div className="screen__button-div">
              {buttons.map((button: ModalButton, i: number) =>
                button?.type === "div" ? (
                  <div key={i} />
                ) : button?.data && !button?.disabled ? (
                  <CSVLink
                    key={i}
                    className={`screen__button--${button?.type}`}
                    data={button?.data}
                    headers={button?.headers}
                    filename={button?.fileName}
                    onClick={() => button?.onClick()}
                    enclosingCharacter=""
                  >
                    {button?.text}
                  </CSVLink>
                ) : (
                  <button
                    key={i}
                    className={`screen__button--${button?.type}`}
                    onClick={() => button?.onClick()}
                    disabled={button?.disabled || button?.loading}
                  >
                    {button?.loading ? (
                      <span className="pr-4">
                        <CircularProgress
                          color="inherit"
                          thickness={5}
                          size={18}
                        />
                      </span>
                    ) : (
                      <span />
                    )}
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
