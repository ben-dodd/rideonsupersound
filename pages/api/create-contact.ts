import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { name, email, phone, postal_address, note } = req.body;
  try {
    const results = await query(
      `
      INSERT INTO contact (name, email, phone, postal_address, note)
      VALUES (?, ?, ?, ?, ?)
      `,
      [name, email, phone, postal_address, note]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
