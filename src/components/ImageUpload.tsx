import React, { useRef } from 'react'
import './ImageUpload.css'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file)
    }
  }

  return (
    <div 
      className="image-upload"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="image-upload__content">
        <p>ドラッグ&ドロップまたはクリックして画像を選択</p>
        <button 
          type="button"
          onClick={handleButtonClick}
          className="image-upload__button"
        >
          画像を選択
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="image-upload__input"
          aria-label="画像ファイル選択"
        />
      </div>
    </div>
  )
}

export default ImageUpload