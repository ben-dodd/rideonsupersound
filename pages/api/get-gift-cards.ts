import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  try {
    const results = await query(
      `
      SELECT
        id,
        is_gift_card,
        gift_card_code,
        gift_card_amount,
        gift_card_remaining,
        gift_card_note,
        gift_card_is_valid,
        date_created,
        date_modified
      FROM stock
      WHERE is_gift_card AND NOT is_deleted
      `
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
