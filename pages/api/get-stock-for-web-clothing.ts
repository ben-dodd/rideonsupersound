import { NextApiHandler } from "next";
import { query } from "../../lib/db";
import { StockMovementTypes } from "@/lib/types";

const handler: NextApiHandler = async (req, res) => {
  try {
    const results = await query(
      `
      SELECT
        s.artist,
        s.title,
        s.display_as,
        s.media,
        s.format,
        s.section,
        s.genre,
        s.is_new,
        s.cond,
        s.image_url,
        s.thumb_url,
        p.total_sell,
        q.quantity
      FROM stock AS s
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity FROM stock_movement GROUP BY stock_id) AS q
        ON q.stock_id = s.id
      LEFT JOIN stock_price AS p ON p.stock_id = s.id
      WHERE
         (p.id = (
            SELECT MAX(id)
            FROM stock_price
            WHERE stock_id = s.id
         ) OR s.is_gift_card OR s.is_misc_item)
      AND s.media = 'Clothing/Accessories'
      AND q.quantity > 0
      AND s.do_list_on_website
      AND NOT is_deleted
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
