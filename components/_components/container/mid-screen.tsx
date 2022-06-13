export default function MidScreenContainer({
  children,
  title,
  titleClass,
  isLoading,
}) {
  return (
    <div className="w-full sm:w-2/3 bg-gray-100">
      {title && (
        <div
          className={`${titleClass} text-4xl font-bold uppercase text-white p-2 mb-1`}
        >
          {title}
        </div>
      )}
      {isLoading ? (
        <div className="loading-screen">
          <div className="loading-icon" />
        </div>
      ) : (
        children
      )}
    </div>
  );
}
