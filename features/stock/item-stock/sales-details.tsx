const SalesDetails = ({ sales }) => {
  console.log(sales)
  return (
    <div>
      {sales?.length === 0 ? (
        <div>This item has no sales.</div>
      ) : (
        sales?.map((sale, i) => (
          <div key={i} className="flex">
            {sale?.id}
          </div>
        ))
      )}
    </div>
  )
}

export default SalesDetails
