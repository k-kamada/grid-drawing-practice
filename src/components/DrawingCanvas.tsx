import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import GridOverlay from './GridOverlay'
import { useDrawingStrokes } from '../hooks/useDrawingStrokes'
import type { DrawingPoint } from '../types/drawing'
import './DrawingCanvas.css'

interface DrawingCanvasProps {
  penSize: number
  penColor: string
  gridVisible: boolean
  gridSize: number
  gridLineWidth: number
  gridColor: string
  onClear?: () => void
}

// 親コンポーネントがアクセスできるメソッドの型定義
export interface DrawingCanvasRef {
  clearCanvas: () => void
}

const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(({
  penSize,
  penColor,
  gridVisible,
  gridSize,
  gridLineWidth,
  gridColor,
  onClear
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })

  // ストローク履歴管理フック
  const {
    startStroke,
    addPointToStroke,
    finishStroke,
    clearAllStrokes,
    redrawAllStrokes
  } = useDrawingStrokes()

  // 親コンポーネントに公開するメソッド
  const clearCanvas = useCallback(() => {
    clearAllStrokes()
    const canvas = canvasRef.current
    if (canvas) {
      const context = canvas.getContext('2d')
      context?.clearRect(0, 0, canvas.width, canvas.height)
    }
    onClear?.()
  }, [clearAllStrokes, onClear])

  useImperativeHandle(ref, () => ({
    clearCanvas
  }), [clearCanvas]);

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

  // キャンバスサイズ変更時にストロークを再描画
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // キャンバスサイズ変更後に全ストロークを再描画
    redrawAllStrokes(canvas)
  }, [canvasSize, redrawAllStrokes])

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

  const getMousePosition = useCallback((event: React.MouseEvent<HTMLCanvasElement>): DrawingPoint => {
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
    
    setIsDrawing(true)
    startStroke(position, penSize, penColor)
  }, [getMousePosition, startStroke, penSize, penColor])

  const draw = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const position = getMousePosition(event)
    const updatedStroke = addPointToStroke(position)
    
    // リアルタイム描画のために現在のストロークのみ描画
    if (updatedStroke) {
      const canvas = canvasRef.current
      const context = canvas?.getContext('2d')
      
      if (context && updatedStroke.points.length >= 2) {
        const lastPoint = updatedStroke.points[updatedStroke.points.length - 2]
        const currentPoint = updatedStroke.points[updatedStroke.points.length - 1]
        
        context.strokeStyle = updatedStroke.penColor
        context.lineWidth = updatedStroke.penSize
        context.lineCap = 'round'
        context.lineJoin = 'round'
        
        context.beginPath()
        context.moveTo(lastPoint.x, lastPoint.y)
        context.lineTo(currentPoint.x, currentPoint.y)
        context.stroke()
      }
    }
  }, [isDrawing, getMousePosition, addPointToStroke])

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      finishStroke()
      setIsDrawing(false)
    }
  }, [isDrawing, finishStroke])


  return (
    <div className="drawing-canvas">
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
})

DrawingCanvas.displayName = 'DrawingCanvas'

export default DrawingCanvas