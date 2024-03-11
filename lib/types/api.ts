import { NextApiRequest } from 'next'

// Custom type definition for Next.js API request with form data
export interface NextApiRequestWithFormData extends NextApiRequest {
  file: {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    destination: string
    filename: string
    path: string
    size: number
  }
}
