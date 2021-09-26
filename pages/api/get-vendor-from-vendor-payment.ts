import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { vendor_payment_id } = req.query;
  try {
    const results = await query(
      `
      SELECT * FROM vendor
      WHERE id IN
        (SELECT vendor_id
          FROM vendor_payment
          WHERE id = ?
        )
      `,
      vendor_payment_id
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
