import React from 'react'
import './GridOverlay.css'

interface GridOverlayProps {
  visible: boolean
  gridSize: number
  lineWidth: number
  color: string
}

const GridOverlay: React.FC<GridOverlayProps> = ({ 
  visible, 
  gridSize, 
  lineWidth, 
  color 
}) => {
  if (!visible) {
    return null
  }


  return (
    <div className="grid-overlay">
      <svg 
        width="100%" 
        height="100%" 
        className="grid-overlay__svg"
        role="img"
        aria-hidden="true"
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
          width="100%"
          height="100%"
          fill="url(#grid)"
        />
      </svg>
    </div>
  )
}

export default GridOverlay