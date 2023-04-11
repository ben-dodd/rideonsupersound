import SalesList from './sales-list'
import SalesViewFilter from './sales-view-filter'

const SalesCalendarView = () => {
  return (
    <div className="h-content overflow-y-scroll">
      <SalesViewFilter />
      <SalesList />
    </div>
  )
}

export default SalesCalendarView
