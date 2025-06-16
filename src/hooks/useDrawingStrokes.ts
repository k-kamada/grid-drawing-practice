import { useState, useCallback } from 'react'
import type { Stroke, DrawingPoint } from '../types/drawing'

export const useDrawingStrokes = () => {
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null)

  // 新しいストロークを開始
  const startStroke = useCallback((point: DrawingPoint, penSize: number, penColor: string) => {
    const newStroke: Stroke = {
      id: `stroke_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      points: [point],
      penSize,
      penColor,
      timestamp: Date.now()
    }
    setCurrentStroke(newStroke)
    return newStroke
  }, [])

  // 現在のストロークにポイントを追加
  const addPointToStroke = useCallback((point: DrawingPoint) => {
    if (!currentStroke) return null
    
    const updatedStroke = {
      ...currentStroke,
      points: [...currentStroke.points, point]
    }
    setCurrentStroke(updatedStroke)
    return updatedStroke
  }, [currentStroke])

  // ストロークを完了してストローク履歴に追加
  const finishStroke = useCallback(() => {
    if (!currentStroke) return
    
    const completedStroke = {
      ...currentStroke,
      duration: Date.now() - currentStroke.timestamp
    }
    
    setStrokes(prev => [...prev, completedStroke])
    setCurrentStroke(null)
    return completedStroke
  }, [currentStroke])

  // 全てのストロークをクリア
  const clearAllStrokes = useCallback(() => {
    setStrokes([])
    setCurrentStroke(null)
  }, [])

  // Canvas上で全ストロークを再描画
  const redrawAllStrokes = useCallback((canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d')
    if (!context) return

    // キャンバスをクリア
    context.clearRect(0, 0, canvas.width, canvas.height)

    // 全ストロークを再描画
    strokes.forEach(stroke => {
      if (stroke.points.length < 2) return

      context.strokeStyle = stroke.penColor
      context.lineWidth = stroke.penSize
      context.lineCap = 'round'
      context.lineJoin = 'round'

      context.beginPath()
      context.moveTo(stroke.points[0].x, stroke.points[0].y)
      
      for (let i = 1; i < stroke.points.length; i++) {
        context.lineTo(stroke.points[i].x, stroke.points[i].y)
      }
      
      context.stroke()
    })

    // 現在描画中のストロークも描画
    if (currentStroke && currentStroke.points.length >= 2) {
      context.strokeStyle = currentStroke.penColor
      context.lineWidth = currentStroke.penSize
      context.lineCap = 'round'
      context.lineJoin = 'round'

      context.beginPath()
      context.moveTo(currentStroke.points[0].x, currentStroke.points[0].y)
      
      for (let i = 1; i < currentStroke.points.length; i++) {
        context.lineTo(currentStroke.points[i].x, currentStroke.points[i].y)
      }
      
      context.stroke()
    }
  }, [strokes, currentStroke])

  return {
    strokes,
    currentStroke,
    startStroke,
    addPointToStroke,
    finishStroke,
    clearAllStrokes,
    redrawAllStrokes
  }
}