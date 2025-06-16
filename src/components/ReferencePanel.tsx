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
  onGridVisibleChange: (visible: boolean) => void
  onGridSizeChange: (size: number) => void
  onImageDimensionsChange: (size: Size | null) => void
}

const ReferencePanel: React.FC<ReferencePanelProps> = ({
  gridVisible,
  gridSize,
  gridLineWidth,
  gridColor,
  onGridVisibleChange,
  onGridSizeChange,
  onImageDimensionsChange,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleImageSelect = (file: File) => {
    const imageUrl = URL.createObjectURL(file)
    setSelectedImage(imageUrl)
    
    // 画像サイズを取得してコールバックで通知
    const img = new Image()
    img.onload = () => {
      onImageDimensionsChange({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }
    img.onerror = () => {
      onImageDimensionsChange(null)
    }
    img.src = imageUrl
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
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}>
                <GridOverlay
                  visible={gridVisible}
                  gridSize={gridSize}
                  lineWidth={gridLineWidth}
                  color={gridColor}
                />
              </div>
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