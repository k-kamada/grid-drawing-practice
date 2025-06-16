// 描画システムの型定義

export interface DrawingPoint {
  x: number
  y: number
  pressure?: number // 将来的なタブレット対応
}

export interface Stroke {
  id: string
  points: DrawingPoint[]
  penSize: number
  penColor: string
  timestamp: number
  duration?: number // メーキング動画用
}

export interface Size {
  width: number
  height: number
}

export interface CanvasState {
  strokes: Stroke[]
  virtualSize: Size  // 最大描画領域
  viewportSize: Size // 現在表示領域
}

// ストローク描画用のヘルパー関数の型
export interface DrawingContext {
  drawStroke: (stroke: Stroke) => void
  redrawAll: (strokes: Stroke[]) => void
  clearCanvas: () => void
}