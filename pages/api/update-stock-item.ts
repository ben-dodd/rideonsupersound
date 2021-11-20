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
  try {
    const results = await query(
      `
        UPDATE stock
        SET
          vendor_id = ${vendor_id || null},
          artist = ${escape(artist)},
          title = ${escape(title)},
          display_as = ${escape(display_as)},
          media = ${escape(media)},
          format = ${escape(format)},
          genre = ${escape(genre)},
          is_new = ${escape(is_new)},
          cond = ${escape(cond)},
          country = ${escape(country)},
          release_year = ${release_year ? `"${release_year}"` : null},
          barcode = ${escape(barcode)},
          publisher = ${escape(publisher)},
          colour = ${escape(colour)},
          size = ${escape(size)},
          description = ${escape(description)},
          note = ${escape(note)},
          image_id = ${image_id || null},
          image_url = ${escape(image_url)},
          thumb_url = ${escape(thumb_url)},
          do_list_on_website = ${do_list_on_website || 0},
          has_no_quantity = ${has_no_quantity || 0},
          is_gift_card = ${is_gift_card || 0},
          gift_card_code = ${escape(gift_card_code)},
          gift_card_amount = ${gift_card_amount || null},
          gift_card_remaining = ${gift_card_remaining || null},
          gift_card_is_valid = ${gift_card_is_valid || null},
          is_misc_item = ${is_misc_item || 0},
          misc_item_description = ${escape(misc_item_description)},
          misc_item_amount = ${misc_item_amount || null},
          tags = ${escape(tags)},
          googleBooksItem = ${escape(JSON.stringify(googleBooksItem))},
          discogsItem = ${escape(JSON.stringify(discogsItem))}
        WHERE id = ${id}
      `
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
