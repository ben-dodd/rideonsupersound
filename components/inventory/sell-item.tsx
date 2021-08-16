export default function SellItem({ item }) {
  // const cart = useSelector((state) => state.local.cart);
  // const savedSales = useSelector((state) => state.local.savedSales);
  // const vendors = useSelector((state) => state.local.vendors);
  // const currentStaff = useSelector((state) => state.local.currentStaff);
  return (
    <div className="flex w-full">
      <div className="font-bold">{`[${item?.id}] ${item?.artist} - ${item?.title}`}</div>
      <div>{`$${((item?.total_sell || 0) / 100).toFixed(2)}`}</div>
    </div>
  );
}
