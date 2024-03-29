import dayjs from 'dayjs'
import { NextApiHandler } from 'next'
import { query } from '../../lib/db'

const handler: NextApiHandler = async (req, res) => {
  const { start_date, end_date, k }: any = req.query
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: 'Resource Denied.' })
    const results = await query(
      `
      SELECT
        sale_transaction.id,
        sale_transaction.sale_id,
        sale_transaction.clerk_id,
        sale_transaction.date,
        sale_transaction.payment_method,
        sale_transaction.amount,
        sale_transaction.cash_received,
        sale_transaction.change_given,
        sale_transaction.vendor_payment_id,
        sale_transaction.gift_card_id,
        sale_transaction.gift_card_taken,
        sale_transaction.gift_card_change,
        sale_transaction.register_id,
        sale_transaction.is_refund,
        sale.item_list,
        sale.total_price,
        sale.store_cut,
        sale.number_of_items
      FROM sale_transaction
      LEFT JOIN sale
        ON sale.id = sale_transaction.sale_id
      WHERE sale_transaction.date >= ?
      AND sale_transaction.date <= ?
      AND sale.is_deleted = 0
      AND sale_transaction.is_deleted = 0
      ORDER BY sale_transaction.date
      `,
      [
        `${dayjs(start_date, 'YYYY-MM-DD').format('YYYY-MM-DD hh:mm:ss')}`,
        `${dayjs(end_date, 'YYYY-MM-DD').format('YYYY-MM-DD hh:mm:ss')}`,
      ]
      // [`${view}`, `${start_date}`, `${end_date}`, `${clerks}`]

      // ${clerks !== 'null' ? `AND sale_opened_by IN (?)` : ''}
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
