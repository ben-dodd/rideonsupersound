import { ModalButton } from 'lib/types'

// TODO make title left aligned with actions on right
export default function SidebarContainer({ show, title, buttons, children }) {
  return (
    <div
      className={`absolute top-0 transition-offset duration-300 ${
        show ? 'left-0 sm:left-2/3' : 'left-full hidden'
      } h-full w-full bg-yellow-200 sm:w-1/3 sm:h-menu`}
    >
      <div className="flex flex-col h-menu px-2 bg-blue-300 text-black">
        {title && <div className="text-lg font-extrabold my-2 tracking-wide self-center">{title}</div>}
        {children}
        {buttons ? (
          <div className="flex px-2 -mr-4 mb-4">
            {buttons?.map((button: ModalButton, i: number) => (
              <button
                key={i}
                className={`modal__button--${button?.type}`}
                disabled={button?.disabled}
                onClick={() => button?.onClick()}
              >
                {button?.text}
              </button>
            ))}
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}

//   show ? "left-0" : "left-full"
// } sm:left-2/3 h-full w-full bg-yellow-200 sm:w-1/3 sm:h-menu`}
