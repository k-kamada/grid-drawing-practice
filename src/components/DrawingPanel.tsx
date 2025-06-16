import React, { useState, useRef } from 'react'
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
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handlePenSizeChange = (size: number) => {
    setPenSize(size)
  }

  const handlePenColorChange = (color: string) => {
    setPenColor(color)
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    
    if (!context || !canvas) return

    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <div className="drawing-panel">
      <div className="drawing-panel__controls">
        <PenControls
          penSize={penSize}
          penColor={penColor}
          onPenSizeChange={handlePenSizeChange}
          onPenColorChange={handlePenColorChange}
          onClear={handleClear}
        />
      </div>
      <div className="drawing-panel__canvas">
        <DrawingCanvas
          penSize={penSize}
          penColor={penColor}
          gridVisible={gridVisible}
          gridSize={gridSize}
          gridLineWidth={gridLineWidth}
          gridColor={gridColor}
          ref={canvasRef}
        />
      </div>
    </div>
  )
}

export default DrawingPanel