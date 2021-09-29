import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { stock_id } = req.query;
  try {
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
        uns.quantity_unsold,
        hol.quantity_hold,
        unh.quantity_unhold,
        lay.quantity_layby,
        unl.quantity_unlayby,
        los.quantity_lost,
        fou.quantity_found,
        dis.quantity_discarded
      FROM stock AS s
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity FROM stock_movement GROUP BY stock_id) AS q
        ON q.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_received FROM stock_movement WHERE act = 'received' GROUP BY stock_id) AS rec
        ON rec.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_returned FROM stock_movement WHERE act = 'returned' GROUP BY stock_id) AS ret
        ON ret.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_sold FROM stock_movement WHERE act = 'sold' GROUP BY stock_id) AS sol
        ON sol.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_unsold FROM stock_movement WHERE act = 'unsold' GROUP BY stock_id) AS uns
        ON uns.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_hold FROM stock_movement WHERE act = 'hold' GROUP BY stock_id) AS hol
        ON hol.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_unhold FROM stock_movement WHERE act = 'unhold' GROUP BY stock_id) AS unh
        ON unh.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_layby FROM stock_movement WHERE act = 'layby' GROUP BY stock_id) AS lay
        ON lay.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_unlayby FROM stock_movement WHERE act = 'unlayby' GROUP BY stock_id) AS unl
        ON unl.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_lost FROM stock_movement WHERE act = 'lost' GROUP BY stock_id) AS los
        ON los.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_found FROM stock_movement WHERE act = 'found' GROUP BY stock_id) AS fou
        ON fou.stock_id = s.id
      LEFT JOIN
        (SELECT stock_id, SUM(quantity) AS quantity_discarded FROM stock_movement WHERE act = 'discarded' GROUP BY stock_id) AS dis
        ON dis.stock_id = s.id
      LEFT JOIN
        stock_price AS p ON p.stock_id = s.id
      WHERE s.id = ?
      `,
      stock_id
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
