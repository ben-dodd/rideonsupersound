import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const {
    description,
    created_by_clerk_id,
    assigned_to_clerk_id,
    is_priority,
  } = req.body;
  try {
    const results = await query(
      `
      INSERT INTO task (description, created_by_clerk_id, assigned_to_clerk_id, is_priority)
      VALUES (?, ?, ?, ?)
      `,
      [description, created_by_clerk_id, assigned_to_clerk_id, is_priority]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
