import { ModalButton } from 'lib/types'

export default function SidebarContainer({
  show = false,
  title = null,
  buttons = null,
  handleSubmit = null,
  children,
}) {
  return (
    <div
      className={`absolute top-12 right-0 h-full w-full sm:w-sidebarSmall lg:w-sidebar md:h-main transition-transform duration-300 transform ${
        show ? 'translate-x-0' : 'translate-x-full'
      } bg-brown-dark text-white`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-main px-4">
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
