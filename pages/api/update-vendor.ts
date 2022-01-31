import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
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
    is_deleted,
    id,
  } = req.body;
  const { k } = req.query;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
      UPDATE vendor
      SET
        name = ?,
        category = ?,
        clerk_id = ?,
        bank_account_number = ?,
        contact_name = ?,
        email = ?,
        phone = ?,
        postal_address = ?,
        note = ?,
        last_contacted = ?,
        store_credit_only = ?,
        is_deleted = ?
      WHERE id = ?
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
        is_deleted,
        id,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
