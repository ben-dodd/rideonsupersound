import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { k } = req.query;
  const {
    description,
    date_started,
    started_by,
    filter_vendor_ids,
    filter_sections,
    filter_media_types,
    filter_formats,
    stocktake_map,
  } = req.body;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
      INSERT INTO stocktake (
        description,
        date_started,
        started_by,
        filter_vendor_ids,
        filter_sections,
        filter_media_types,
        filter_formats,
        stocktake_map
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        description,
        date_started,
        started_by,
        filter_vendor_ids,
        filter_sections,
        filter_media_types,
        filter_formats,
        stocktake_map,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
