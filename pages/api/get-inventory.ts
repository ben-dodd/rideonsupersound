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
        rec.quantity_received,
        ret.quantity_returned
      FROM stock AS s
      LEFT JOIN
      (SELECT stock_id, SUM(quantity) AS quantity_received FROM stock_movement WHERE act = 'received' GROUP BY stock_id) AS rec
      ON rec.stock_id = s.id
      LEFT JOIN
      (SELECT stock_id, SUM(quantity) AS quantity_returned FROM stock_movement WHERE act = 'returned' GROUP BY stock_id) AS ret
      ON ret.stock_id = s.id
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

// SELECT
//   s.id,
//   s.vendor_id,
//   s.artist,
//   s.title,
//   s.format,
//   s.genre,
//   s.is_new,
//   s.cond,
//   stock_price1.vendor_cut,
//   stock_price1.total_sell,
//   q.quantity
// FROM
//   stock AS s
// LEFT JOIN
//   (
//       SELECT
//           stock_movement.stock_id,
//           SUM(stock_movement.quantity) AS quantity
//       FROM
//           stock_movement
//       GROUP BY
//           stock_movement.stock_id
//       ORDER BY
//           NULL
//   ) AS q
//       ON q.stock_id = s.id
// LEFT JOIN
//   stock_price AS stock_price1
//       ON stock_price1.stock_id = s.id
// LEFT JOIN
//   stock_price AS stock_price2
//       ON (
//           stock_price2.stock_id = s.id
//       )
//       AND (
//           stock_price1.id < stock_price2.id
//       )
// WHERE
//   (
//       1 = 1
//       AND s.is_deleted = 0
//   )
//   AND (
//       stock_price2.id IS NULL
//   )
