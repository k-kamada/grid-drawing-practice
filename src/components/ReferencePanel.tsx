import React, { useState } from 'react'
import ImageUpload from './ImageUpload'
import ImageDisplay from './ImageDisplay'
import GridOverlay from './GridOverlay'
import type { Size } from '../types/drawing'
import './ReferencePanel.css'

interface ReferencePanelProps {
  gridVisible: boolean
  gridSize: number
  gridLineWidth: number
  gridColor: string
  scrollPosition: { x: number, y: number }
  onGridVisibleChange: (visible: boolean) => void
  onGridSizeChange: (size: number) => void
  onImageDimensionsChange: (size: Size | null) => void
  onScrollChange: (position: { x: number, y: number }) => void
}

const ReferencePanel: React.FC<ReferencePanelProps> = ({
  gridVisible,
  gridSize,
  gridLineWidth,
  gridColor,
  scrollPosition,
  onGridVisibleChange,
  onGridSizeChange,
  onImageDimensionsChange,
  onScrollChange,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageSize, setImageSize] = useState<Size | null>(null)

  const handleImageSelect = (file: File) => {
    const imageUrl = URL.createObjectURL(file)
    setSelectedImage(imageUrl)
  }

  const handleImageDimensionsChange = (size: Size | null) => {
    setImageSize(size)
    onImageDimensionsChange(size)
  }

  const handleGridToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    onGridVisibleChange(event.target.checked)
  }

  const handleGridSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onGridSizeChange(Number(event.target.value))
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
                max="300"
                step="10"
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
            <ImageDisplay 
              imageSrc={selectedImage}
              scrollPosition={scrollPosition}
              onScrollChange={onScrollChange}
              onImageDimensionsChange={handleImageDimensionsChange}
              gridVisible={gridVisible}
              gridSize={gridSize}
              gridLineWidth={gridLineWidth}
              gridColor={gridColor}
              imageSize={imageSize}
            />
          </div>
        ) : (
          <ImageUpload onImageSelect={handleImageSelect} />
        )}
      </div>
    </div>
  )
}

export default ReferencePanel