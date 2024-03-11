import { NextApiResponse } from 'next'
import aws from 'aws-sdk'
import multer from 'multer'
import sharp from 'sharp'
import { NextApiRequestWithFormData } from 'lib/types/api'
import { v4 as uuid } from 'uuid'

// Configure AWS SDK
const s3 = new aws.S3({
  endpoint: new aws.Endpoint(process.env.S3_ENDPOINT),
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION,
})

// Initialize multer storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB file size limit
  },
}).single('image') // Assuming the file input field is named "image"

export const config = {
  api: {
    bodyParser: false,
  },
}

// Upload API route
export default async function handler(req: NextApiRequestWithFormData, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Use multer middleware to handle file uploads
      upload(req, res, async function (error) {
        if (error) {
          console.error('Error handling file upload:', error)
          return res.status(400).json({ error: 'Failed to process file upload' })
        }

        const file = req.file // File uploaded via multer

        if (!file) {
          return res.status(400).json({ error: 'No file uploaded' })
        }

        try {
          // Resize the image using sharp
          const resizedImageBuffer = await sharp(file.buffer)
            .resize({ width: 300, height: 300 }) // Resize to 300x300 pixels
            .toBuffer()

          const uploadParams = {
            Bucket: process.env.S3_BUCKET,
            ACL: 'public-read',
            Key: `${uuid()}${file.originalname}`, // Use the original file name as the key
            Body: resizedImageBuffer, // Use the resized image buffer
            ContentType: file.mimetype, // Use the MIME type of the file
          }

          // Upload the resized image to AWS S3
          const uploadResult = await s3.upload(uploadParams).promise()

          return res.json({
            url: uploadResult?.Location,
          })
        } catch (resizeError) {
          console.error('Error resizing image:', resizeError)
          return res.status(500).json({ error: 'Failed to resize image' })
        }
      })
    } catch (error) {
      console.error('Error uploading file:', error)
      return res.status(500).json({ error: 'Failed to upload file' })
    }
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
