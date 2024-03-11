import { useState } from 'react'

const UploadButton = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    setSelectedFile(file)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedFile) return

    const formData = new FormData()
    formData.append('image', selectedFile)

    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        body: formData,
      })
      if (response.ok) {
        const data = await response.json()
        onUpload(data.imageUrl) // Execute callback function with the new image URL
        setSelectedFile(null) // Clear the selected image
        alert('Image uploaded successfully!')
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
  )
}

export default UploadButton
