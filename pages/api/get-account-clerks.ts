import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { account_id } = req.query;
  try {
    const results = await query(
      `
      SELECT *
      FROM clerk
      WHERE id IN (
        SELECT clerk_id
        FROM account_clerk
        WHERE account_id = ?
      )
      `,
      account_id
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
