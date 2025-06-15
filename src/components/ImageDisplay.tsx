import React from 'react'
import './ImageDisplay.css'

interface ImageDisplayProps {
  imageSrc: string | null
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageSrc }) => {
  const hasValidImage = imageSrc && imageSrc.trim() !== ''

  return (
    <div className="image-display">
      {hasValidImage ? (
        <img 
          src={imageSrc} 
          alt="お手本画像"
          className="image-display__image"
        />
      ) : (
        <div className="image-display__placeholder">
          <p>画像が選択されていません</p>
        </div>
      )}
    </div>
  )
}

export default ImageDisplay