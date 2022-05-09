import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const {
    description,
    date_started,
    started_by,
    date_finished,
    finished_by,
    filter_vendor_ids,
    filter_sections,
    filter_media_types,
    filter_formats,
    stocktake_map,
    is_deleted,
    id,
  } = req.body;
  const { k } = req.query;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
      UPDATE stocktake
      SET
        description = ?,
        date_started = ?,
        started_by = ?,
        date_finished = ?,
        finished_by = ?,
        filter_vendor_ids = ?,
        filter_sections = ?,
        filter_media_types = ?,
        filter_formats = ?,
        stocktake_map = ?,
        is_deleted = ?
      WHERE id = ?
      `,
      [
        description,
        date_started,
        started_by,
        date_finished,
        finished_by,
        filter_vendor_ids,
        filter_sections,
        filter_media_types,
        filter_formats,
        stocktake_map,
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
