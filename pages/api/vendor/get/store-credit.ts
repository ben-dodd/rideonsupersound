import { query } from 'lib/database/utils/db'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const { uid } = req.query
  try {
    const results = await query(
      `
      SELECT sale.item_list, payment.vendor_payment_id
        FROM sale INNER JOIN
          (SELECT sale_id, vendor_payment_id FROM sale_transaction
            WHERE vendor_payment_id IN
              (SELECT id FROM vendor_payment WHERE vendor_id = (
                SELECT id FROM vendor WHERE uid = ?
                ))) AS payment
            ON sale.id = payment.sale_id
      `,
      uid
    )

    return res.json(results)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export default handler
