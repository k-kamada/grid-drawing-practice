import React, { useState } from 'react'
import ImageUpload from './ImageUpload'
import ImageDisplay from './ImageDisplay'
import GridOverlay from './GridOverlay'
import './ReferencePanel.css'

const ReferencePanel: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [gridVisible, setGridVisible] = useState(false)
  const [gridSize, setGridSize] = useState(20)
  const [gridLineWidth] = useState(1)
  const [gridColor] = useState('#000000')

  const handleImageSelect = (file: File) => {
    const imageUrl = URL.createObjectURL(file)
    setSelectedImage(imageUrl)
  }

  const handleGridToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGridVisible(event.target.checked)
  }

  const handleGridSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGridSize(Number(event.target.value))
  }

  return (
    <div className="reference-panel">
      <div className="reference-panel__controls">
        <div className="reference-panel__grid-controls">
          <h3>グリッド設定</h3>
          <div className="reference-panel__control-group">
            <label>
              <input
                type="checkbox"
                checked={gridVisible}
                onChange={handleGridToggle}
                aria-label="グリッド表示"
              />
              グリッド表示
            </label>
          </div>
          <div className="reference-panel__control-group">
            <label>
              グリッドサイズ:
              <input
                type="number"
                value={gridSize}
                onChange={handleGridSizeChange}
                min="10"
                max="100"
                step="5"
                aria-label="グリッドサイズ"
              />
              px
            </label>
          </div>
        </div>
      </div>

      <div className="reference-panel__image-area">
        {selectedImage ? (
          <div className="reference-panel__image-container" data-testid="image-container">
            <ImageDisplay imageSrc={selectedImage} />
            {gridVisible && (
              <GridOverlay
                visible={gridVisible}
                gridSize={gridSize}
                lineWidth={gridLineWidth}
                color={gridColor}
              />
            )}
          </div>
        ) : (
          <ImageUpload onImageSelect={handleImageSelect} />
        )}
      </div>
    </div>
  )
}

export default ReferencePanel