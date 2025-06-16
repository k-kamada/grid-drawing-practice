import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import GridOverlay from './GridOverlay'
import { useDrawingStrokes } from '../hooks/useDrawingStrokes'
import type { DrawingPoint, Size } from '../types/drawing'
import './DrawingCanvas.css'

interface DrawingCanvasProps {
  penSize: number
  penColor: string
  gridVisible: boolean
  gridSize: number
  gridLineWidth: number
  gridColor: string
  imageSize?: Size | null // 未使用（緊急修正）
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
  // imageSize, // 緊急修正：未使用
  onClear
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  // ストローク履歴管理フック
  const {
    startStroke,
    addPointToStroke,
    finishStroke,
    clearAllStrokes
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

  // コンテナサイズ監視と仮想キャンバス更新（緊急修正：簡素化）
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    // 固定サイズでキャンバスを初期化
    canvas.width = 1200
    canvas.height = 800
  }, [])

  // 仮想キャンバスサイズ変更時にストロークを再描画（緊急修正：無効化）
  // useEffect(() => {
  //   const canvas = canvasRef.current
  //   if (!canvas) return

  //   // 描画中でなければストロークを再描画
  //   if (!isDrawing) {
  //     redrawAllStrokes(canvas)
  //   }
  // }, [virtualSize, isDrawing, redrawAllStrokes])

  // お手本画像サイズ変更時の仮想キャンバス更新（緊急修正：無効化）
  // useEffect(() => {
  //   if (imageSize) {
  //     updateImageSize(imageSize)
  //   }
  // }, [imageSize, updateImageSize])

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
    
    // 固定サイズキャンバス座標系への変換
    const canvasX = (event.clientX - rect.left) * (canvas.width / rect.width)
    const canvasY = (event.clientY - rect.top) * (canvas.height / rect.height)
    
    return {
      x: canvasX,
      y: canvasY
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
      <div 
        ref={containerRef} 
        className="drawing-canvas__viewport"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
      >
        <canvas
          ref={canvasRef}
          width={1200}
          height={800}
          className="drawing-canvas__canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          role="img"
          aria-label="描画キャンバス"
          style={{
            display: 'block',
            width: '100%',
            height: '100%'
          }}
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
  )
})

DrawingCanvas.displayName = 'DrawingCanvas'

export default DrawingCanvas