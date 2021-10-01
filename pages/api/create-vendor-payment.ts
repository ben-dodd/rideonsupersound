import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const {
    amount,
    bank_account_number,
    batch_number,
    sequence_number,
    clerk_id,
    vendor_id,
    type,
  } = req.body;
  try {
    const results = await query(
      `
      INSERT INTO vendor_payment (
        amount,
        bank_account_number,
        batch_number,
        sequence_number,
        clerk_id,
        vendor_id,
        type
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        amount,
        bank_account_number,
        batch_number,
        sequence_number,
        clerk_id,
        vendor_id,
        type,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
