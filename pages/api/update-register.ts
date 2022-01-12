import { NextApiHandler } from "next";
import { query } from "../../lib/db";
import { escape } from "sqlstring";

const handler: NextApiHandler = async (req, res) => {
  const {
    id,
    close_amount,
    closed_by_id,
    close_petty_balance,
    close_cash_given,
    close_manual_payments,
    close_expected_amount,
    close_discrepancy,
    close_note,
    close_till_id,
    close_date,
  } = req.body;
  const { k } = req.query;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
        UPDATE register
        SET
          close_amount = ?,
          closed_by_id = ?,
          close_petty_balance = ?,
          close_cash_given = ?,
          close_manual_payments = ?,
          close_expected_amount = ?,
          close_discrepancy = ?,
          close_note = ?,
          close_till_id = ?,
          close_date = ?
        WHERE id = ?
      `,
      [
        close_amount,
        closed_by_id,
        close_petty_balance,
        close_cash_given,
        close_manual_payments,
        close_expected_amount,
        close_discrepancy,
        close_note,
        close_till_id,
        close_date,
        id,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
