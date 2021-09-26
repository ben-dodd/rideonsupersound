import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { contact_id } = req.query;
  try {
    const results = await query(
      `
      SELECT date, amount
      FROM vendor_payment
      WHERE vendor_id IN
        (SELECT id
          FROM vendor
          WHERE contact_id = ?)
      `,
      contact_id
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
