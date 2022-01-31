import { NextApiHandler } from "next";
import { query } from "../../lib/db";
import { escape } from "sqlstring";

const handler: NextApiHandler = async (req, res) => {
  const {
    id,
    hold_period,
    note,
    date_removed_from_hold,
    removed_from_hold_by,
  } = req.body;
  const { k } = req.query;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
        UPDATE hold
        SET
          hold_period = ?,
          note = ?,
          date_removed_from_hold = ?,
          removed_from_hold_by = ?
        WHERE id = ?
      `,
      [hold_period, note, date_removed_from_hold, removed_from_hold_by, id]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
