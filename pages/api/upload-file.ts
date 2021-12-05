import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const body = req.body;
  const { k } = req.query;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    await fetch("https://hmn.exu.mybluehost.me/upload-manager.php", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body,
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  } catch (e) {
    throw Error(e.message);
  }
};

export default handler;
