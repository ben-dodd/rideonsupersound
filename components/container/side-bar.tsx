import { ModalButton } from 'lib/types'

// TODO make title left aligned with actions on right
export default function SidebarContainer({ show, title, buttons, handleSubmit, children }) {
  return (
    <div
      className={`absolute top-0 transition-offset duration-300 ${
        show ? 'left-0 sm:left-2/3' : 'left-full hidden'
      } h-full w-full bg-yellow-200 sm:w-1/3 sm:h-main`}
    >
      <div className="flex flex-col h-main p-2 bg-blue-300 text-black">
        {title && <div className="text-lg font-extrabold my-2 tracking-wide self-center">{title}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full">
          {children}
          {buttons ? (
            <div className="grid grid-cols-2 gap-4 mt-2">
              {buttons?.map((button: ModalButton, i: number) => (
                <button
                  key={i}
                  type={button?.type === 'ok' ? 'submit' : 'button'}
                  className={`modal__button--${button?.type}`}
                  disabled={button?.disabled}
                  onClick={() => button?.onClick?.()}
                >
                  {button?.text}
                </button>
              ))}
            </div>
          ) : (
            <div />
          )}
        </form>
      </div>
    </div>
  )
}

//   show ? "left-0" : "left-full"
// } sm:left-2/3 h-full w-full bg-yellow-200 sm:w-1/3 sm:h-main`}
