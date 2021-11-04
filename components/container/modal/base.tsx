export default function ModalBase({
  open = false,
  onClose = null,
  disableBackdropClick = false,
  width = "md",
  children,
}) {
  return (
    <div
      className={`${
        !open && "opacity-0 pointer-events-none "
      }transition-opacity duration-200 ease-in-out absolute w-full h-full top-0 left-0 flex items-center justify-center`}
    >
      <div
        onClick={disableBackdropClick ? null : onClose}
        className="absolute w-full h-full bg-green-900 opacity-50"
      />
      <div
        className={`bg-white w-11/12 sm:max-w-${width} mx-auto rounded shadow-md z-40 overflow-y-auto overflow-x-hidden`}
      >
        {children}
      </div>
    </div>
  );
}
