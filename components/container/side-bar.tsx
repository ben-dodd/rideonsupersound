import { ModalButton } from 'lib/types'

// TODO make title left aligned with actions on right
export default function SidebarContainer({
  show = false,
  title = null,
  buttons = null,
  handleSubmit = null,
  children,
}) {
  return (
    <div
      className={`absolute top-0 transition-offset duration-300 ${
        show ? 'right-0' : '-right-sidebar hidden'
      } md:left-boardMain h-full w-full md:w-sidebar md:h-main`}
      // 'right-0' : '-right-sidebar hidden'
      // } h-full w-full bg-yellow-200 sm:w-sidebarSmall lg:w-sidebar sm:h-main
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-main px-4 bg-gray-200 text-black">
        {title && <div className="text-xl font-bold my-2 tracking-wide">{title}</div>}
        {children}
        {buttons ? (
          <div className="modal__button-div my-4">
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
  )
}

//   show ? "left-0" : "left-full"
// } sm:left-2/3 h-full w-full bg-yellow-200 sm:w-1/3 sm:h-main`}
