import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { id, hold_period, note } = req.body;
  try {
    const results = await query(
      `
        UPDATE hold
        SET
          hold_period=${hold_period || null},
          note=${note || null}
        WHERE id = ${id}
      `
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
