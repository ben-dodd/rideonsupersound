import { NextApiHandler } from 'next'
import { query } from '@/lib/db'
import { StockMovementTypes } from '@/lib/types'

const handler: NextApiHandler = async (req, res) => {
  const { stock_id, k } = req.query
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: 'Resource Denied.' })
    const results = await query(
      `
      SELECT
        s.*,
        p.vendor_cut,
        p.total_sell,
        q.quantity,
        rec.quantity_received,
        ret.quantity_returned,
        sol.quantity_sold,
        hol.quantity_hold,
        lay.quantity_layby,
        los.quantity_lost,
        dis.quantity_discarded,
        adj.quantity_adjustment
      FROM stock AS s
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity FROM stock_movement WHERE NOT is_deleted GROUP BY stock_id) AS q
        ON q.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_received FROM stock_movement WHERE NOT is_deleted AND act = '${StockMovementTypes.Received}' GROUP BY stock_id) AS rec
        ON rec.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_returned FROM stock_movement WHERE NOT is_deleted AND act = '${StockMovementTypes.Returned}' GROUP BY stock_id) AS ret
        ON ret.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_sold FROM stock_movement WHERE NOT is_deleted AND (act = '${StockMovementTypes.Sold}' OR act = '${StockMovementTypes.Unsold}') GROUP BY stock_id) AS sol
        ON sol.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_hold FROM stock_movement WHERE NOT is_deleted AND (act = '${StockMovementTypes.Hold}' OR act = '${StockMovementTypes.Unhold}') GROUP BY stock_id) AS hol
        ON hol.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_layby FROM stock_movement WHERE NOT is_deleted AND (act = '${StockMovementTypes.Layby}' OR act = '${StockMovementTypes.Unlayby}') GROUP BY stock_id) AS lay
        ON lay.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_lost FROM stock_movement WHERE NOT is_deleted AND (act = '${StockMovementTypes.Lost}' OR act = '${StockMovementTypes.Found}') GROUP BY stock_id) AS los
        ON los.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_discarded FROM stock_movement WHERE NOT is_deleted AND act = '${StockMovementTypes.Discarded}' GROUP BY stock_id) AS dis
        ON dis.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_adjustment FROM stock_movement WHERE NOT is_deleted AND act = '${StockMovementTypes.Adjustment}' GROUP BY stock_id) AS adj
        ON adj.stock_id = s.id
      LEFT JOIN
        stock_price AS p ON p.stock_id = s.id
        WHERE
           p.id = (
              SELECT MAX(id)
              FROM stock_price
              WHERE stock_id = s.id
            )
      AND s.id = ?
      `,
      stock_id
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
