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
  imageSize?: Size | null
  scrollPosition?: { x: number, y: number }
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
  imageSize,
  scrollPosition = { x: 0, y: 0 },
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

  // コンテナサイズ監視と動的キャンバスサイズ設定
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const updateCanvasSize = () => {
      if (isDrawing) return // 描画中はサイズ変更しない
      
      const { clientWidth, clientHeight } = container
      
      // スクロール可能領域を確保するため、実際のキャンバスサイズを150%に
      const actualWidth = Math.max(clientWidth * 1.5, imageSize?.width || clientWidth)
      const actualHeight = Math.max(clientHeight * 1.5, imageSize?.height || clientHeight)
      
      // DPR考慮で真の等倍表示を実現
      const dpr = window.devicePixelRatio || 1
      
      // 内部解像度をDPRに応じて高解像度化
      canvas.width = actualWidth * dpr
      canvas.height = actualHeight * dpr
      
      // CSS表示サイズを実際のサイズに設定
      canvas.style.width = `${actualWidth}px`
      canvas.style.height = `${actualHeight}px`
      
      // コンテキスト設定とDPR補正
      const context = canvas.getContext('2d')
      if (context) {
        // DPRに応じてスケール調整（重要！）
        context.scale(dpr, dpr)
        
        context.strokeStyle = penColor
        context.lineWidth = penSize
        context.lineCap = 'round'
        context.lineJoin = 'round'
        // アンチエイリアス無効化
        context.imageSmoothingEnabled = false
      }
      
      console.log('Canvas size updated:', { 
        width: canvas.width, 
        height: canvas.height, 
        containerWidth: clientWidth, 
        containerHeight: clientHeight,
        dpr 
      })
      
      redrawAllStrokes(canvas)
    }
    
    // 初期サイズ設定
    updateCanvasSize()
    
    const resizeObserver = new ResizeObserver(updateCanvasSize)
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [redrawAllStrokes, penColor, penSize, isDrawing, imageSize])  // imageSize も依存関係に追加

  // 初期化時のストローク復元
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // 初期化時にストロークを復元
    redrawAllStrokes(canvas)
  }, [redrawAllStrokes])

  // スクロール位置同期
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    console.log('DrawingCanvas scroll sync:', scrollPosition)
    // お手本側のスクロール位置に同期
    container.scrollLeft = scrollPosition.x
    container.scrollTop = scrollPosition.y
  }, [scrollPosition])

  // カスタムカーソルを生成
  const generateCursor = useCallback((size: number) => {
    const cursorSize = Math.max(24, size * 2 + 12) // 最小24px、ペンサイズに応じて拡大
    const center = cursorSize / 2
    const radius = Math.max(8, size + 6) // 最小8px、ペンサイズに応じて拡大
    
    const svg = `
      <svg width="${cursorSize}" height="${cursorSize}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#fff" stroke-width="2"/>
        <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#000" stroke-width="1"/>
      </svg>
    `.trim()
    
    const encodedSvg = encodeURIComponent(svg)
    return `url("data:image/svg+xml,${encodedSvg}") ${center} ${center}, crosshair`
  }, [])

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
    const container = containerRef.current
    if (!canvas || !container) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    
    // マウス位置からキャンバス内の相対座標を計算
    const canvasX = event.clientX - rect.left
    const canvasY = event.clientY - rect.top
    
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
      // 重いので削除: 描画完了時の再描画は不要
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
          position: 'relative',
          overflow: 'auto'  // スクロール可能にする
        }}
      >
        <canvas
          ref={canvasRef}
          className="drawing-canvas__canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          role="img"
          aria-label="描画キャンバス"
          style={{
            display: 'block',
            imageRendering: 'pixelated',  // アンチエイリアス無効化
            backgroundColor: 'white',  // 背景を白に設定
            cursor: generateCursor(penSize)  // ペンサイズに応じたカスタムカーソル
          }}
        />
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
    </div>
  )
})

DrawingCanvas.displayName = 'DrawingCanvas'

export default DrawingCanvas