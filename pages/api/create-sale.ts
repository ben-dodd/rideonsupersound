import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { k } = req.query;
  const {
    customer_id,
    state,
    sale_opened_by,
    weather,
    geo_latitude,
    geo_longitude,
    note,
    layby_started_by,
    date_layby_started,
    sale_closed_by,
    date_sale_closed,
    store_cut,
    total_price,
    number_of_items,
    item_list,
  } = req.body;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
      INSERT INTO sale (
        customer_id,
        state,
        sale_opened_by,
        weather,
        geo_latitude,
        geo_longitude,
        note,
        layby_started_by,
        sale_closed_by,
        store_cut,
        total_price,
        number_of_items,
        item_list,
        date_layby_started,
        date_sale_closed
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ${
        date_layby_started === "CURRENT_TIMESTAMP"
          ? "CURRENT_TIMESTAMP"
          : date_layby_started
          ? `"${date_layby_started}"`
          : null
      }, ${
        date_sale_closed === "CURRENT_TIMESTAMP"
          ? "CURRENT_TIMESTAMP"
          : date_sale_closed
          ? `"${date_sale_closed}"`
          : null
      })
      `,
      [
        customer_id,
        state,
        sale_opened_by,
        weather,
        geo_latitude,
        geo_longitude,
        note,
        layby_started_by,
        sale_closed_by,
        store_cut,
        total_price,
        number_of_items,
        item_list,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
