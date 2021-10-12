import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { register_id } = req.query;
  try {
    const results = await query(
      `
      SELECT sale_id, clerk_id, date, payment_method, total_amount, cash_received
      FROM sale_transaction
      WHERE register_id = ${register_id} AND cash_received AND is_deleted = FALSE
      `
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
