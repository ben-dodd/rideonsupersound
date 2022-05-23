import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const {
    stocktake_template_id,
    date_started,
    started_by,
    date_closed,
    closed_by,
    date_cancelled,
    cancelled_by,
    counted_items,
    reviewed_items,
    total_counted,
    total_unique_counted,
    total_estimated,
    total_unique_estimated,
    is_deleted,
    id,
  } = req.body;
  const { k } = req.query;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
      UPDATE stocktake
      SET
        stocktake_template_id = ?,
        date_started = ?,
        started_by = ?,
        date_closed = ?,
        closed_by = ?,
        date_cancelled = ?,
        cancelled_by = ?,
        counted_items = ?,
        reviewed_items = ?,
        total_counted = ?,
        total_unique_counted = ?,
        total_estimated = ?,
        total_unique_estimated = ?,
        is_deleted = ?
      WHERE id = ?
      `,
      [
        stocktake_template_id,
        date_started,
        started_by,
        date_closed,
        closed_by,
        date_cancelled,
        cancelled_by,
        counted_items ? JSON.stringify(counted_items) : null,
        reviewed_items ? JSON.stringify(reviewed_items) : null,
        total_counted,
        total_unique_counted,
        total_estimated,
        total_unique_estimated,
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
