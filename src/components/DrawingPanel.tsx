import React, { useState } from 'react'
import PenControls from './PenControls'
import DrawingCanvas from './DrawingCanvas'
import './DrawingPanel.css'

interface DrawingPanelProps {
  gridVisible: boolean
  gridSize: number
  gridLineWidth: number
  gridColor: string
}

const DrawingPanel: React.FC<DrawingPanelProps> = ({
  gridVisible,
  gridSize,
  gridLineWidth,
  gridColor,
}) => {
  const [penSize, setPenSize] = useState(1)
  const [penColor, setPenColor] = useState('#000000')

  const handlePenSizeChange = (size: number) => {
    setPenSize(size)
  }

  const handlePenColorChange = (color: string) => {
    setPenColor(color)
  }

  const handleClear = () => {
    // Clear event handled by DrawingCanvas
  }

  return (
    <div className="drawing-panel">
      <div className="drawing-panel__controls">
        <PenControls
          penSize={penSize}
          penColor={penColor}
          onPenSizeChange={handlePenSizeChange}
          onPenColorChange={handlePenColorChange}
        />
      </div>
      <div className="drawing-panel__canvas">
        <DrawingCanvas
          penSize={penSize}
          penColor={penColor}
          onClear={handleClear}
          gridVisible={gridVisible}
          gridSize={gridSize}
          gridLineWidth={gridLineWidth}
          gridColor={gridColor}
        />
      </div>
    </div>
  )
}

export default DrawingPanel