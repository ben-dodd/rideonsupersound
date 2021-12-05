import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { id, gift_card_remaining, gift_card_is_valid } = req.body;
  const { k } = req.query;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
        UPDATE stock
        SET
        gift_card_remaining = ${gift_card_remaining || 0},
        gift_card_is_valid = ${gift_card_is_valid || 1}
        WHERE id = ${id}
      `
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
