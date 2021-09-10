import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const {
    contact_id,
    state,
    sale_opened_by,
    note,
    weather,
    geo_latitude,
    geo_longitude,
  } = req.body;
  try {
    const results = await query(
      `
      INSERT INTO sale (
        contact_id,
        state,
        sale_opened_by,
        weather,
        geo_latitude,
        geo_longitude,
        note
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        contact_id,
        state,
        sale_opened_by,
        weather,
        geo_latitude,
        geo_longitude,
        note,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
