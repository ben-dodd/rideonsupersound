import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  try {
    const results = await query(
      `
      SELECT
        s.id,
        s.vendor_id,
        s.artist,
        s.title,
        s.format,
        s.genre,
        s.is_new,
        s.cond,
        p.vendor_cut,
        p.total_sell,
        q.quantity
      FROM stock AS s
      LEFT JOIN
      (SELECT stock_id, SUM(quantity) AS quantity FROM stock_movement GROUP BY stock_id) AS q
      ON q.stock_id = s.id
      LEFT JOIN stock_price AS p ON p.stock_id = s.id
      WHERE
         p.id = (
            SELECT MAX(id)
            FROM stock_price
            WHERE stock_id = s.id
         )
      AND s.is_deleted = 0
      `
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
