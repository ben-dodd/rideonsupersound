import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { id, completed_by_clerk_id } = req.body;
  try {
    const results = await query(
      `
        UPDATE task
        SET
          completed_by_clerk_id=${completed_by_clerk_id || null},
          is_completed=1
        WHERE id = ${id}
      `
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
