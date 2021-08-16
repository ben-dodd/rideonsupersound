export default function Modal({
  open = false,
  onClose = null,
  disableBackdropClick = false,
  children,
}) {
  console.log(open);
  return (
    <div
      className={`${
        !open && "opacity-0 pointer-events-none "
      }transition-opacity duration-300 ease-in-out absolute w-full h-full top-0 left-0 flex items-center justify-center`}
    >
      <div
        onClick={disableBackdropClick ? null : onClose}
        className="absolute w-full h-full bg-green-900 opacity-50"
      />
      <div
        className={`bg-white w-11/12 sm:max-w-md mx-auto rounded shadow-md z-40 overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  );
}
