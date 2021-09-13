import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const {
    sale_id,
    clerk_id,
    payment_method,
    total_amount,
    cash_received,
    change_given,
    vendor_payment_id,
    gift_card_id,
    card_taken,
  } = req.body;
  console.log(req.body);
  try {
    const results = await query(
      `
      INSERT INTO transaction (
        sale_id,
        clerk_id,
        payment_method,
        total_amount,
        cash_received,
        change_given,
        vendor_payment_id,
        gift_card_id,
        card_taken
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        sale_id,
        clerk_id,
        payment_method,
        total_amount,
        cash_received,
        change_given,
        vendor_payment_id,
        gift_card_id,
        card_taken,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
