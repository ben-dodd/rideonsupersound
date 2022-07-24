import { query } from 'lib/db'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const { sale_id, k } = req.query
  let newSale: any = {}
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: 'Resource Denied.' })
    const sale_result = await query(
      `
      SELECT * FROM sale WHERE id = ${sale_id}
      `
    )
    const sale_data = await JSON.parse(JSON.stringify(sale_result))
    newSale = { ...sale_data[0] }
    try {
      const item_result = await query(
        `
        SELECT * FROM sale_item WHERE sale_id = ${sale_id}
        `
      )
      const item_data = await JSON.parse(JSON.stringify(item_result))
      newSale.items = item_data
      try {
        const transaction_result = await query(
          `
          SELECT * FROM sale_transaction WHERE sale_id = ${sale_id}
          `
        )
        const transaction_data = await JSON.parse(
          JSON.stringify(transaction_result)
        )
        newSale.transactions = transaction_data
        return res.send(newSale)
      } catch (e) {
        throw new Error(e.message)
      }
    } catch (e) {
      throw new Error(e.message)
    }
  } catch (e) {
    throw new Error(e.message)
  }
}

export default handler
