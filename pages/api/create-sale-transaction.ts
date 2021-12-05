import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { k } = req.query;
  const {
    sale_id,
    clerk_id,
    payment_method,
    amount,
    cash_received,
    change_given,
    register_id,
    vendor_payment_id,
    gift_card_id,
    gift_card_taken,
    gift_card_change,
    is_refund,
  } = req.body;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
      INSERT INTO sale_transaction (
        sale_id,
        clerk_id,
        payment_method,
        amount,
        cash_received,
        change_given,
        register_id,
        vendor_payment_id,
        gift_card_id,
        gift_card_taken,
        gift_card_change,
        is_refund
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        sale_id,
        clerk_id,
        payment_method,
        amount,
        cash_received,
        change_given,
        register_id,
        vendor_payment_id,
        gift_card_id,
        gift_card_taken,
        gift_card_change,
        is_refund,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
