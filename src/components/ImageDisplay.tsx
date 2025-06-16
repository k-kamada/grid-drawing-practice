import React, { useEffect, useRef } from 'react'
import GridOverlay from './GridOverlay'
import './ImageDisplay.css'

interface ImageDisplayProps {
  imageSrc: string | null
  scrollPosition?: { x: number, y: number }
  onScrollChange?: (position: { x: number, y: number }) => void
  onImageDimensionsChange?: (size: { width: number, height: number } | null) => void
  gridVisible?: boolean
  gridSize?: number
  gridLineWidth?: number
  gridColor?: string
  imageSize?: { width: number, height: number } | null
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  imageSrc, 
  scrollPosition = { x: 0, y: 0 }, 
  onScrollChange,
  onImageDimensionsChange,
  gridVisible = false,
  gridSize = 100,
  gridLineWidth = 1,
  gridColor = '#000000',
  imageSize
}) => {
  const hasValidImage = imageSrc && imageSrc.trim() !== ''
  const containerRef = useRef<HTMLDivElement>(null)
  
  // 外部からのスクロール位置変更に同期
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    
    container.scrollLeft = scrollPosition.x
    container.scrollTop = scrollPosition.y
  }, [scrollPosition])
  
  // スクロールイベントを検出して外部に通知
  const handleScroll = () => {
    const container = containerRef.current
    if (!container || !onScrollChange) return
    
    const newPosition = {
      x: container.scrollLeft,
      y: container.scrollTop
    }
    
    console.log('ImageDisplay scroll detected:', newPosition)
    onScrollChange(newPosition)
  }

  // 画像読み込み時のサイズ取得
  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget
    if (onImageDimensionsChange) {
      onImageDimensionsChange({
        width: img.naturalWidth,
        height: img.naturalHeight
      })
    }
  }

  return (
    <div 
      ref={containerRef}
      className="image-display"
      onScroll={handleScroll}
      style={{
        overflow: 'auto',
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    >
      {hasValidImage ? (
        <img 
          src={imageSrc} 
          alt="お手本画像"
          className="image-display__image"
          onLoad={handleImageLoad}
          style={{
            display: 'block',
            maxWidth: 'none',  // 元サイズ表示
            maxHeight: 'none'
          }}
        />
      ) : (
        <div className="image-display__placeholder">
          <p>画像が選択されていません</p>
        </div>
      )}
      {gridVisible && (
        <GridOverlay
          visible={gridVisible}
          gridSize={gridSize}
          lineWidth={gridLineWidth}
          color={gridColor}
          imageSize={imageSize}
        />
      )}
    </div>
  )
}

export default ImageDisplay