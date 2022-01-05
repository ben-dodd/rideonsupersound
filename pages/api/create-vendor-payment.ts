import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { k } = req.query;
  const {
    amount,
    bank_account_number,
    batch_number,
    sequence_number,
    clerk_id,
    vendor_id,
    register_id,
    type,
    date,
  } = req.body;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
      INSERT INTO vendor_payment (
        amount,
        bank_account_number,
        batch_number,
        sequence_number,
        clerk_id,
        vendor_id,
        register_id,
        type,
        date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        amount,
        bank_account_number,
        batch_number,
        sequence_number,
        clerk_id,
        vendor_id,
        register_id,
        type,
        date,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
