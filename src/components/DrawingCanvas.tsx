import React, { useRef, useEffect, useState, useCallback } from 'react'
import GridOverlay from './GridOverlay'
import './DrawingCanvas.css'

interface DrawingCanvasProps {
  penSize: number
  penColor: string
  onClear: () => void
  gridVisible: boolean
  gridSize: number
  gridLineWidth: number
  gridColor: string
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  penSize,
  penColor,
  onClear,
  gridVisible,
  gridSize,
  gridLineWidth,
  gridColor
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })

  // コンテナサイズに応じてキャンバスサイズを調整
  useEffect(() => {
    const updateCanvasSize = () => {
      const container = containerRef.current
      if (!container) return

      const { clientWidth, clientHeight } = container
      setCanvasSize({ width: clientWidth, height: clientHeight })
    }

    updateCanvasSize()
    
    const resizeObserver = new ResizeObserver(updateCanvasSize)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    context.strokeStyle = penColor
    context.lineWidth = penSize
    context.lineCap = 'round'
    context.lineJoin = 'round'
  }, [penSize, penColor])

  const getMousePosition = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    
    // Canvas内部座標系と表示座標系のスケール比を計算
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    }
  }, [])

  const startDrawing = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const position = getMousePosition(event)
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    
    if (!context) return

    setIsDrawing(true)
    
    context.beginPath()
    context.moveTo(position.x, position.y)
  }, [getMousePosition])

  const draw = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const position = getMousePosition(event)
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    
    if (!context) return

    context.lineTo(position.x, position.y)
    context.stroke()
  }, [isDrawing, getMousePosition])

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
  }, [])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    
    if (!context || !canvas) return

    context.clearRect(0, 0, canvas.width, canvas.height)
    onClear()
  }, [onClear])

  return (
    <div className="drawing-canvas">
      <div className="drawing-canvas__controls">
        <button
          type="button"
          onClick={clearCanvas}
          className="drawing-canvas__clear-button"
        >
          クリア
        </button>
      </div>
      <div className="drawing-canvas__area">
        <div ref={containerRef} className="drawing-canvas__container">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="drawing-canvas__canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            role="img"
            aria-label="描画キャンバス"
          />
          {gridVisible && (
            <GridOverlay
              visible={gridVisible}
              gridSize={gridSize}
              lineWidth={gridLineWidth}
              color={gridColor}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default DrawingCanvas