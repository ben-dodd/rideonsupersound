import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { register_id } = req.body;
  try {
    const results = await query(
      `
      UPDATE global
      SET
        value = ${register_id}
      WHERE id = 'current_register'
      `
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
