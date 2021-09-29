import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { setting_select } = req.query;
  try {
    const results = await query(
      `
      SELECT label
      FROM select_option
      WHERE setting_select = ?
      `,
      setting_select
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
