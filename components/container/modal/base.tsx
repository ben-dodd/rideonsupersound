export default function ModalBase({
  open = false,
  onClose = null,
  disableBackdropClick = false,
  width = "max-w-md",
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
<<<<<<< HEAD
        className={`bg-white w-11/12 ${width} mx-auto rounded shadow-md z-40 overflow-y-auto overflow-x-hidden`}
=======
        className={`bg-white w-11/12 max-w-md sm:${width} mx-auto rounded shadow-md z-40 overflow-y-auto overflow-x-hidden`}
>>>>>>> 4bd0a420f130ad8e2106f232c13e4ff18214d7fe
      >
        {children}
      </div>
    </div>
  );
}
