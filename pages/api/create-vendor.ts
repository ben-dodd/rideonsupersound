import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { k } = req.query;
  const {
    name,
    vendor_category,
    clerk_id,
    bank_account_number,
    contact_name,
    email,
    phone,
    postal_address,
    note,
    last_contacted,
    store_credit_only,
    email_vendor,
    uid,
  } = req.body;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
      INSERT INTO vendor (
        name,
        vendor_category,
        clerk_id,
        bank_account_number,
        contact_name,
        email,
        phone,
        postal_address,
        note,
        last_contacted,
        store_credit_only,
        email_vendor,
        uid
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        vendor_category,
        clerk_id,
        bank_account_number,
        contact_name,
        email,
        phone,
        postal_address,
        note,
        last_contacted,
        store_credit_only,
        email_vendor,
        uid,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
