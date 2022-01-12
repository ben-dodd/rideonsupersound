import { NextApiHandler } from "next";
import { query } from "../../lib/db";
import { escape } from "sqlstring";

const handler: NextApiHandler = async (req, res) => {
  const {
    id,
    vendor_id,
    artist,
    title,
    display_as,
    media,
    format,
    genre,
    is_new,
    cond,
    country,
    release_year,
    barcode,
    publisher,
    colour,
    size,
    description,
    note,
    image_id,
    image_url,
    thumb_url,
    do_list_on_website,
    has_no_quantity,
    is_gift_card,
    gift_card_code,
    gift_card_amount,
    gift_card_remaining,
    gift_card_is_valid,
    is_misc_item,
    misc_item_description,
    misc_item_amount,
    tags,
    googleBooksItem,
    discogsItem,
  } = req.body;
  const { k } = req.query;
  try {
    if (!k || k !== process.env.NEXT_PUBLIC_SWR_API_KEY)
      return res.status(401).json({ message: "Resource Denied." });
    const results = await query(
      `
        UPDATE stock
        SET
          vendor_id = ?,
          artist = ?,
          title = ?,
          display_as = ?,
          media = ?,
          format = ?,
          genre = ?,
          is_new = ?,
          cond = ?,
          country = ?,
          release_year = ?,
          barcode = ?,
          publisher = ?,
          colour = ?,
          size = ?,
          description = ?,
          note = ?,
          image_id = ?,
          image_url = ?,
          thumb_url = ?,
          do_list_on_website = ?,
          has_no_quantity = ?,
          is_gift_card = ?,
          gift_card_code = ?,
          gift_card_amount = ?,
          gift_card_remaining = ?,
          gift_card_is_valid = ?,
          is_misc_item = ?,
          misc_item_description = ?,
          misc_item_amount = ?,
          tags = ?,
          googleBooksItem = ?,
          discogsItem = ?
        WHERE id = ?
      `,
      [
        vendor_id,
        artist,
        title,
        display_as,
        media,
        format,
        genre,
        is_new,
        cond,
        country,
        release_year,
        barcode,
        publisher,
        colour,
        size,
        description,
        note,
        image_id,
        image_url,
        thumb_url,
        do_list_on_website,
        has_no_quantity,
        is_gift_card,
        gift_card_code,
        gift_card_amount,
        gift_card_remaining,
        gift_card_is_valid,
        is_misc_item,
        misc_item_description,
        misc_item_amount,
        tags,
        JSON.stringify(googleBooksItem),
        JSON.stringify(discogsItem),
        id,
      ]
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
