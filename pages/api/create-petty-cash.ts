import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { k } = req.query;
  const { register_id, clerk_id, amount, is_take, note } = req.body;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
      INSERT INTO register_petty_cash (register_id, clerk_id, amount, is_take, note)
      VALUES (?, ?, ?, ?, ?)
      `,
      [register_id, clerk_id, amount, is_take, note]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
