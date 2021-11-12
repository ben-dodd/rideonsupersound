import { NextApiHandler } from "next";
import { query } from "../../lib/db";
import { escape } from "sqlstring";

const handler: NextApiHandler = async (req, res) => {
  const {
    sale_id,
    customer_id,
    state,
    note,
    date_layby_started,
    layby_started_by,
  } = req.body;
  try {
    const results = await query(
      `
      UPDATE sale
      SET
        customer_id = ${customer_id},
        state = ${state ? `"${state}"` : null},
        note = ${escape(note)},
        date_layby_started = ${
          date_layby_started ? `"${date_layby_started}"` : null
        },
        layby_started_by = ${layby_started_by}
      WHERE id = ${sale_id}
      `
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
