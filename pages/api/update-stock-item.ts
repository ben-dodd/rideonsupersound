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
    do_list_on_website,
    has_no_quantity,
    is_gift_card,
    gift_card_code,
    gift_card_amount,
    gift_card_note,
    is_misc_item,
    misc_item_description,
    misc_item_amount,
    tags,
    googleBooksItem,
    discogsItem,
  } = req.body;
  console.log(`
  UPDATE stock
  SET
    vendor_id = ${vendor_id || null},
    artist = ${artist ? `"${artist}"` : null},
    title = ${title ? `"${title}"` : null},
    display_as = ${display_as ? `"${display_as}"` : null},
    media = ${media ? `"${media}"` : null},
    format = ${format ? `"${format}"` : null},
    genre = ${genre ? `"${genre}"` : null},
    is_new = ${is_new || null},
    cond = ${cond ? `"${cond}"` : null},
    country = ${country ? `"${country}"` : null},
    release_year = ${release_year ? `"${release_year}"` : null},
    barcode = ${barcode ? `"${barcode}"` : null},
    publisher = ${publisher ? `"${publisher}"` : null},
    colour = ${colour ? `"${colour}"` : null},
    size = ${size ? `"${size}"` : null},
    description = ${description ? `"${description}"` : null},
    note = ${note ? `"${note}"` : null},
    image_id = ${image_id || null},
    image_url = ${image_url ? `"${image_url}"` : null},
    do_list_on_website = ${do_list_on_website || 0},
    has_no_quantity = ${has_no_quantity || 0},
    is_gift_card = ${is_gift_card || 0},
    gift_card_code = ${gift_card_code ? `"${gift_card_code}"` : null},
    gift_card_amount = ${gift_card_amount || null},
    gift_card_note = ${gift_card_note ? `"${gift_card_note}"` : null},
    is_misc_item = ${is_misc_item || 0},
    misc_item_description = ${
      misc_item_description ? `"${misc_item_description}"` : null
    },
    misc_item_amount = ${misc_item_amount || null},
    tags = ${tags ? `"${tags}"` : null},
    googleBooksItem = ${
      googleBooksItem ? `"${escape(JSON.stringify(googleBooksItem))}"` : null
    },
    discogsItem = ${
      discogsItem ? `"${escape(JSON.stringify(discogsItem))}"` : null
    }
  WHERE id = ${id}
  `);
  try {
    const results = await query(
      `
      UPDATE stock
      SET
        vendor_id = ${vendor_id || null},
        artist = ${artist ? `"${artist}"` : null},
        title = ${title ? `"${title}"` : null},
        display_as = ${display_as ? `"${display_as}"` : null},
        media = ${media ? `"${media}"` : null},
        format = ${format ? `"${format}"` : null},
        genre = ${genre ? `"${genre}"` : null},
        is_new = ${is_new || null},
        cond = ${cond ? `"${cond}"` : null},
        country = ${country ? `"${country}"` : null},
        release_year = ${release_year ? `"${release_year}"` : null},
        barcode = ${barcode ? `"${barcode}"` : null},
        publisher = ${publisher ? `"${publisher}"` : null},
        colour = ${colour ? `"${colour}"` : null},
        size = ${size ? `"${size}"` : null},
        description = ${description ? `"${description}"` : null},
        note = ${note ? `"${note}"` : null},
        image_id = ${image_id || null},
        image_url = ${image_url ? `"${image_url}"` : null},
        do_list_on_website = ${do_list_on_website || 0},
        has_no_quantity = ${has_no_quantity || 0},
        is_gift_card = ${is_gift_card || 0},
        gift_card_code = ${gift_card_code ? `"${gift_card_code}"` : null},
        gift_card_amount = ${gift_card_amount || null},
        gift_card_note = ${gift_card_note ? `"${gift_card_note}"` : null},
        is_misc_item = ${is_misc_item || 0},
        misc_item_description = ${
          misc_item_description ? `"${misc_item_description}"` : null
        },
        misc_item_amount = ${misc_item_amount || null},
        tags = ${tags ? `"${tags}"` : null},
        googleBooksItem = ${
          googleBooksItem ? escape(JSON.stringify(googleBooksItem)) : null
        },
        discogsItem = ${
          discogsItem ? escape(JSON.stringify(discogsItem)) : null
        }
      WHERE id = ${id}
      `
    );
    return res.json(results);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export default handler;
