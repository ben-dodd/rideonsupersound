import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { k } = req.query;
  const {
    name,
    filter_description,
    image,
    vendor_enabled,
    vendor_list,
    section_enabled,
    section_list,
    media_enabled,
    media_list,
    format_enabled,
    format_list,
    total_estimated,
    total_unique_estimated,
  } = req.body;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
      INSERT INTO stocktake_template (
        name,
        filter_description,
        image,
        vendor_enabled,
        vendor_list,
        section_enabled,
        section_list,
        media_enabled,
        media_list,
        format_enabled,
        format_list,
        total_estimated,
        total_unique_estimated
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        filter_description,
        image,
        vendor_enabled,
        vendor_list ? JSON.stringify(vendor_list) : null,
        section_enabled,
        section_list ? JSON.stringify(section_list) : null,
        media_enabled,
        media_list ? JSON.stringify(media_list) : null,
        format_enabled,
        format_list ? JSON.stringify(format_list) : null,
        total_estimated,
        total_unique_estimated,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
