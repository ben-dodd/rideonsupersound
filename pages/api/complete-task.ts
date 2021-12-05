import { NextApiHandler } from "next";
import { query } from "../../lib/db";

const handler: NextApiHandler = async (req, res) => {
  const { k } = req.query;
  const { id, completed_by_clerk_id } = req.body;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
          UPDATE task
          SET
            completed_by_clerk_id=${completed_by_clerk_id || null},
            is_completed=1
          WHERE id = ${id}
        `
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
  // } else {
  //   // Not Signed in
  //   res.status(401);
  // }
};

export default handler;
