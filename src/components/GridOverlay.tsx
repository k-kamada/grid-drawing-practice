import React from 'react'
import './GridOverlay.css'

interface GridOverlayProps {
  visible: boolean
  gridSize: number
  lineWidth: number
  color: string
  imageSize?: { width: number, height: number } | null
}

const GridOverlay: React.FC<GridOverlayProps> = ({ 
  visible, 
  gridSize, 
  lineWidth, 
  color,
  imageSize
}) => {
  if (!visible) {
    return null
  }

  // お手本画像サイズに合わせてグリッド表示領域を決定
  const gridWidth = imageSize ? `${imageSize.width}px` : '100%'
  const gridHeight = imageSize ? `${imageSize.height}px` : '100%'

  return (
    <div className="grid-overlay">
      <svg 
        width={gridWidth}
        height={gridHeight}
        className="grid-overlay__svg"
        role="img"
        aria-hidden="true"
        style={{
          minWidth: gridWidth,
          minHeight: gridHeight
        }}
      >
        <defs>
          <pattern
            id="grid"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={gridSize}
              stroke={color}
              strokeWidth={lineWidth}
            />
            <line
              x1={0}
              y1={0}
              x2={gridSize}
              y2={0}
              stroke={color}
              strokeWidth={lineWidth}
            />
          </pattern>
        </defs>
        <rect
          width={gridWidth}
          height={gridHeight}
          fill="url(#grid)"
        />
      </svg>
    </div>
  )
}

export default GridOverlay