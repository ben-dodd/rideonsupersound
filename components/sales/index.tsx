import dayjs from 'dayjs'
import SalesItem from './item'
import Title from '../layout/title'

export default function Sales({ sales, vendorStock }) {
  return (
    <div className="w-full">
      <Title title={'RIDE ON SUPER SOUND SALES'} />
      {sales?.length === 0 ? (
        <div>NO SALES</div>
      ) : (
        <div>
          <div className="flex bg-black py-2 text-white text-xs">
            <div className="w-3/12 px-1 md:w-1/12">DATE SOLD</div>
            <div className="w-1/12 px-1 hidden md:inline">STOCK REMAINING</div>
            <div className="w-1/12 px-1">FORMAT</div>
            <div className="w-2/12 px-1">ARTIST</div>
            <div className="w-2/12 px-1 md:w-3/12">TITLE</div>
            <div className="w-2/12 px-1 text-right md:w-1/12">RETAIL PRICE</div>
            <div className="w-1/12 px-1 text-right hidden md:inline">
              ROSS TAKE
            </div>
            <div className="w-2/12 px-1 md:w-1/12 text-right">VENDOR TAKE</div>
          </div>
          {sales?.map((sale, i) => {
            // console.log(sale);
            const stockItem = vendorStock?.filter(
              (s) => s?.id === sale?.item_id
            )[0]
            // console.log(stockItem);
            return <SalesItem key={i} sale={sale} stockItem={stockItem} />
          })}
        </div>
      )}
      {/* <XYPlot height={300} width={300}>
        <VerticalBarSeries data={saleData} />
        <XAxis />
        <YAxis />
      </XYPlot> */}
    </div>
  )
}
