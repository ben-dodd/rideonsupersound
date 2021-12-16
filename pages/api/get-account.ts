import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { email } = req.query;
  try {
    if (!email) return res.status(400).json({ message: "User signed out." });
    const results = await query(
      `
      SELECT id, email, is_admin, is_authenticated
      FROM account
      WHERE email = ?
      `,
      email
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
