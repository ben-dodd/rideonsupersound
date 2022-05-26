import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { k } = req.query;
  const {
    stocktake_template_id,
    date_started,
    started_by,
    date_closed,
    closed_by,
    date_cancelled,
    cancelled_by,
    total_counted,
    total_unique_counted,
    total_estimated,
    total_unique_estimated,
  } = req.body;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
      INSERT INTO stocktake (
        stocktake_template_id,
        date_started,
        started_by,
        date_closed,
        closed_by,
        date_cancelled,
        cancelled_by,
        total_counted,
        total_unique_counted,
        total_estimated,
        total_unique_estimated
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        stocktake_template_id,
        date_started,
        started_by,
        date_closed,
        closed_by,
        date_cancelled,
        cancelled_by,
        total_counted,
        total_unique_counted,
        total_estimated,
        total_unique_estimated,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
