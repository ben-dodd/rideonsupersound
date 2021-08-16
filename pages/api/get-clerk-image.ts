import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { clerk_image_id } = req.query;
  try {
    const results = await query(
      `
      SELECT image
      FROM image
      WHERE id = ?
      `,
      clerk_image_id
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
