import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const {
    stock_id,
    stocktake_id,
    quantity_counted,
    quantity_recorded,
    quantity_difference,
    review_decision,
    date_counted,
    counted_by,
    do_check_details,
    is_deleted,
    id,
  } = req.body;
  const { k } = req.query;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
      UPDATE stocktake_item
      SET
        stock_id = ?,
        stocktake_id = ?,
        quantity_counted = ?,
        quantity_recorded = ?,
        quantity_difference = ?,
        review_decision = ?,
        date_counted = ?,
        counted_by = ?,
        do_check_details = ?,
        is_deleted = ?
      WHERE id = ?
      `,
      [
        stock_id,
        stocktake_id,
        quantity_counted,
        quantity_recorded,
        quantity_difference,
        review_decision,
        date_counted,
        counted_by,
        do_check_details,
        is_deleted,
        id,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
