import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { k } = req.query;
  const {
    id,
    stock_id,
    stocktake_id,
    quantity_counted,
    quantity_recorded,
    quantity_difference,
    review_decision,
    date_counted,
    counted_by,
  } = req.body;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
      INSERT INTO stocktake_item (
        id,
        stock_id,
        stocktake_id,
        quantity_counted,
        quantity_recorded,
        quantity_difference,
        review_decision,
        date_counted,
        counted_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        id,
        stock_id,
        stocktake_id,
        quantity_counted,
        quantity_recorded,
        quantity_difference,
        review_decision,
        date_counted,
        counted_by,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
