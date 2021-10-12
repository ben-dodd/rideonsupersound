import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const {
    one_hundred_dollar,
    fifty_dollar,
    twenty_dollar,
    ten_dollar,
    five_dollar,
    two_dollar,
    one_dollar,
    fifty_cent,
    twenty_cent,
    ten_cent,
  } = req.body;
  try {
    const results = await query(
      `
      INSERT INTO register_till (one_hundred_dollar, fifty_dollar, twenty_dollar, ten_dollar, five_dollar, two_dollar, one_dollar, fifty_cent, twenty_cent, ten_cent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        one_hundred_dollar,
        fifty_dollar,
        twenty_dollar,
        ten_dollar,
        five_dollar,
        two_dollar,
        one_dollar,
        fifty_cent,
        twenty_cent,
        ten_cent,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
