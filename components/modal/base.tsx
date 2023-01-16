export default function ModalBase({
  open = false,
  onClose = null,
  disableBackdropClick = false,
  width = 'max-w-md',
  children,
}) {
  return (
    <div
      className={`${
        !open && 'opacity-0 pointer-events-none '
      }transition-opacity duration-200 ease-in-out absolute w-screen h-screen top-0 left-0 flex items-center justify-center`}
    >
      <div onClick={disableBackdropClick ? null : onClose} className="absolute w-full h-full bg-green-900 opacity-50" />
      <div className={`bg-white w-11/12 ${width} mx-auto z-50 rounded-md shadow-2xl`}>{children}</div>
    </div>
  )
}
