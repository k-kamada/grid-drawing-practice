import React, { useState, useRef } from 'react'
import PenControls from './PenControls'
import DrawingCanvas, { type DrawingCanvasRef } from './DrawingCanvas'
import type { Size } from '../types/drawing'
import './DrawingPanel.css'

interface DrawingPanelProps {
  gridVisible: boolean
  gridSize: number
  gridLineWidth: number
  gridColor: string
  imageSize?: Size | null
  scrollPosition: { x: number, y: number }
  overlayVisible: boolean
  referenceImageSrc: string | null
  onOverlayToggle: (visible: boolean) => void
}

const DrawingPanel: React.FC<DrawingPanelProps> = ({
  gridVisible,
  gridSize,
  gridLineWidth,
  gridColor,
  imageSize,
  scrollPosition,
  overlayVisible,
  referenceImageSrc,
  onOverlayToggle,
}) => {
  const [penSize, setPenSize] = useState(1)
  const [penColor, setPenColor] = useState('#000000')
  const canvasRef = useRef<DrawingCanvasRef>(null)

  const handlePenSizeChange = (size: number) => {
    setPenSize(size)
  }

  const handlePenColorChange = (color: string) => {
    setPenColor(color)
  }

  const handleClear = () => {
    canvasRef.current?.clearCanvas()
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
          overlayVisible={overlayVisible}
          onOverlayToggle={onOverlayToggle}
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
          imageSize={imageSize}
          scrollPosition={scrollPosition}
          overlayVisible={overlayVisible}
          referenceImageSrc={referenceImageSrc}
          ref={canvasRef}
        />
      </div>
    </div>
  )
}

export default DrawingPanel