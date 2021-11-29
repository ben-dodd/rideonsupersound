import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  try {
    const results = await query(
      `
      SELECT *
      FROM task
      WHERE NOT is_deleted
      AND NOT is_completed
      OR date_completed > date_sub(now(), interval 1 week)
      ORDER BY date_created desc
      `
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
