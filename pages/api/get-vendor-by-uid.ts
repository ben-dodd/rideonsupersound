import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { uid } = req.query;
  try {
    const results = await query(
      `
      SELECT * FROM vendor
      WHERE uid = ?
      `,
      uid
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
