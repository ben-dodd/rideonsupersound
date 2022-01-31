import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { k } = req.query;
  const {
    name,
    category,
    clerk_id,
    bank_account_number,
    contact_name,
    email,
    phone,
    postal_address,
    note,
    last_contacted,
    store_credit_only,
  } = req.body;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
      INSERT INTO vendor (
        name,
        category,
        clerk_id,
        bank_account_number,
        contact_name,
        email,
        phone,
        postal_address,
        note,
        last_contacted,
        store_credit_only
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        category,
        clerk_id,
        bank_account_number,
        contact_name,
        email,
        phone,
        postal_address,
        note,
        last_contacted,
        store_credit_only,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
