import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { k } = req.query;
  const {
    description,
    created_by_clerk_id,
    assigned_to,
    assigned_to_clerk_id,
    is_priority,
    date_created,
    is_post_mail_order,
  } = req.body;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
      INSERT INTO task (
        description,
        created_by_clerk_id,
        assigned_to,
        assigned_to_clerk_id,
        is_priority,
        date_created,
        is_post_mail_order
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        description,
        created_by_clerk_id,
        assigned_to,
        assigned_to_clerk_id,
        is_priority,
        date_created,
        is_post_mail_order,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
