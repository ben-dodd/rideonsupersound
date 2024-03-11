export const UploadableImage = ({ imageUrl, onImageUpload }) => {
  const handleFileChange = async (e) => {
    const file = e?.target?.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    console.log(formData)

    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        body: formData,
      })
      if (response.ok) {
        const data = await response.json()
        onImageUpload(data.imageUrl) // Execute callback function with the new image URL
        alert('Image uploaded successfully!')
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    }
  }

  const handleImageClick = () => {
    const fileInput = document.getElementById('file-input')
    if (fileInput) {
      fileInput.click() // Trigger file input click event
    }
  }

  return (
    <>
      <img
        className="h-full w-full object-cover cursor-pointer hover:opacity-50"
        src={imageUrl}
        alt={'Info Box Image'}
        onClick={handleImageClick}
      />
      <input id="file-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
    </>
  )
}
