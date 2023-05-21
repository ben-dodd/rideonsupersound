// TODO add warning if item is on hold
const Warning = ({ item, itemQuantity, isInCart }) => {
  return (
    <div className={`${item?.needsRestock ? 'text-yellow-400' : 'text-red-400'} font-bold text-2xl`}>
      {item?.needsRestock || (isInCart && itemQuantity > 0)
        ? 'PLEASE RESTOCK!'
        : itemQuantity !== undefined && itemQuantity !== null && !isInCart && itemQuantity < 1
        ? 'OUT OF STOCK'
        : ''}
    </div>
  )
}

export default Warning
