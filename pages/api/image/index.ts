import { NextApiResponse } from 'next'
import multer from 'multer'
import sharp from 'sharp'
import { NextApiRequestWithFormData } from 'lib/types/api'

// Multer configuration
const upload = multer({ dest: 'public/uploads/' })

export const config = {
  api: {
    bodyParser: false,
  },
}

// Upload API route
export default async function handler(req: NextApiRequestWithFormData, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Multer middleware to handle image upload
    upload.single('image')(req, res, async (err: any) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ error: 'Failed to upload image' })
      }

      try {
        // Resize the uploaded image
        const resizedImagePath = `public/uploads/resized/${req.file.originalname}`
        await sharp(req.file.path)
          .resize({ width: 300, fit: 'cover' }) // Resize to 300 pixels width and maintain aspect ratio
          .jpeg({ quality: 80 }) // Convert to JPEG format with 80% quality
          .toFile(resizedImagePath)

        // Get the URL of the resized image
        const imageUrl = `/uploads/resized/${req.file.originalname}`

        // Respond with the URL of the resized image
        return res.status(201).json({ message: 'Image uploaded and resized successfully', imageUrl })
      } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Failed to process image' })
      }
    })
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
