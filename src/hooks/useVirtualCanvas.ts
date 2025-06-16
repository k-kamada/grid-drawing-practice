import { useState, useCallback, useEffect } from 'react'
import type { Size } from '../types/drawing'

interface VirtualCanvasConfig {
  imageSize?: Size | null
  defaultSize?: Size
  minSize?: Size
  maxSizeRatio?: number // デバイス画面サイズに対する割合
}

interface VirtualCanvasState {
  virtualSize: Size
  viewportSize: Size
  needsScroll: boolean
  scale: number
}

export const useVirtualCanvas = (config: VirtualCanvasConfig = {}) => {
  const {
    imageSize = null,
    defaultSize = { width: 1200, height: 800 },
    minSize = { width: 800, height: 600 },
    maxSizeRatio = 0.9
  } = config

  const [virtualSize, setVirtualSize] = useState<Size>(defaultSize)
  const [viewportSize, setViewportSize] = useState<Size>({ width: 800, height: 600 })

  // 最大サイズの計算（デバイス制約考慮）
  const calculateMaxSize = useCallback((): Size => {
    const maxWidth = Math.min(screen.width * maxSizeRatio, 3840) // 4K制限
    const maxHeight = Math.min(screen.height * maxSizeRatio, 2160)
    return { width: maxWidth, height: maxHeight }
  }, [maxSizeRatio])

  // 仮想キャンバスサイズの計算
  const calculateVirtualSize = useCallback((
    currentViewport: Size,
    imageSize?: Size | null,
    previousVirtual?: Size
  ): Size => {
    const maxSize = calculateMaxSize()
    
    // 基準サイズの決定（お手本画像 > デフォルト > 現在のビューポート）
    const baseWidth = imageSize?.width || defaultSize.width
    const baseHeight = imageSize?.height || defaultSize.height
    
    // 最小保証サイズ
    const guaranteedWidth = Math.max(currentViewport.width, minSize.width)
    const guaranteedHeight = Math.max(currentViewport.height, minSize.height)
    
    // 過去最大サイズの保持（縮小防止）
    const previousWidth = previousVirtual?.width || 0
    const previousHeight = previousVirtual?.height || 0
    
    // 最終サイズの決定
    const finalWidth = Math.min(
      maxSize.width,
      Math.max(baseWidth, guaranteedWidth, previousWidth)
    )
    const finalHeight = Math.min(
      maxSize.height,
      Math.max(baseHeight, guaranteedHeight, previousHeight)
    )

    return { width: finalWidth, height: finalHeight }
  }, [calculateMaxSize, defaultSize, minSize])

  // ビューポートサイズの更新
  const updateViewportSize = useCallback((newViewportSize: Size) => {
    setViewportSize(newViewportSize)
    
    // 仮想サイズの再計算
    setVirtualSize(prevVirtual => 
      calculateVirtualSize(newViewportSize, imageSize, prevVirtual)
    )
  }, [calculateVirtualSize, imageSize])

  // お手本画像サイズ変更時の処理
  const updateImageSize = useCallback((newImageSize: Size | null) => {
    setVirtualSize(prevVirtual => 
      calculateVirtualSize(viewportSize, newImageSize, prevVirtual)
    )
  }, [calculateVirtualSize, viewportSize])

  // スクロールが必要かどうかの判定
  const needsScroll = virtualSize.width > viewportSize.width || 
                     virtualSize.height > viewportSize.height

  // スケール比の計算（表示用）
  const scale = Math.min(
    viewportSize.width / virtualSize.width,
    viewportSize.height / virtualSize.height
  )

  // 初期化時の画像サイズ反映
  useEffect(() => {
    if (imageSize) {
      updateImageSize(imageSize)
    }
  }, [imageSize, updateImageSize])

  const state: VirtualCanvasState = {
    virtualSize,
    viewportSize,
    needsScroll,
    scale: needsScroll ? 1 : scale
  }

  return {
    ...state,
    updateViewportSize,
    updateImageSize,
    calculateVirtualSize
  }
}