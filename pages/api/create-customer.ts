import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const {
    name,
    email,
    phone,
    postal_address,
    note,
    created_by_clerk_id,
  } = req.body;
  try {
    const results = await query(
      `
      INSERT INTO customer (name, email, phone, postal_address, note, created_by_clerk_id)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [name, email, phone, postal_address, note, created_by_clerk_id]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
