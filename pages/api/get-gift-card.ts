import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { gift_card_id } = req.query;
  try {
    const results = await query(
      `
      SELECT
        id,
        is_gift_card,
        gift_card_code,
        gift_card_taken,
        gift_card_change_given,
        gift_card_amount,
        gift_card_remaining,
        gift_card_is_valid,
        date_created,
        date_modified
      FROM stock
      WHERE id = ?
      `,
      gift_card_id
    );

    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
