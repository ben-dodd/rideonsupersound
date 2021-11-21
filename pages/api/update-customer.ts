import { NextApiHandler } from "next";
import { query } from "../../lib/db";
import { escape } from "sqlstring";

const handler: NextApiHandler = async (req, res) => {
  const { id, name, email, phone, postal_address, note, is_deleted } = req.body;
  try {
    const results = await query(
      `
      UPDATE customer
      SET
        name = ${name ? `"${name}"` : null},
        email = ${email ? `"${email}"` : null},
        phone = ${phone ? `"${phone}"` : null},
        postal_address = ${postal_address ? `"${postal_address}"` : null},
        note = ${escape(note)},
        is_deleted = ${is_deleted || null}
      WHERE id = ${id}
      `
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
