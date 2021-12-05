import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { k } = req.query;
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
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
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
