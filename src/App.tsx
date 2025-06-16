import { useState } from 'react'
import SplitLayout from './components/SplitLayout'
import ReferencePanel from './components/ReferencePanel'
import DrawingPanel from './components/DrawingPanel'
import type { Size } from './types/drawing'
import './App.css'

function App() {
  const [gridVisible, setGridVisible] = useState(false)
  const [gridSize, setGridSize] = useState(100)
  const [gridLineWidth] = useState(1)
  const [gridColor] = useState('#000000')
  const [imageSize, setImageSize] = useState<Size | null>(null)
  
  // 同期スクロール位置の状態管理
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })
  
  // スクロール位置変更のデバッグ
  const handleScrollChange = (position: { x: number, y: number }) => {
    console.log('App scroll change:', position)
    setScrollPosition(position)
  }

  const leftContent = (
    <ReferencePanel 
      gridVisible={gridVisible}
      gridSize={gridSize}
      gridLineWidth={gridLineWidth}
      gridColor={gridColor}
      scrollPosition={scrollPosition}
      onGridVisibleChange={setGridVisible}
      onGridSizeChange={setGridSize}
      onImageDimensionsChange={setImageSize}
      onScrollChange={handleScrollChange}
    />
  )
  
  const rightContent = (
    <DrawingPanel 
      gridVisible={gridVisible}
      gridSize={gridSize}
      gridLineWidth={gridLineWidth}
      gridColor={gridColor}
      imageSize={imageSize}
      scrollPosition={scrollPosition}
    />
  )

  return <SplitLayout leftContent={leftContent} rightContent={rightContent} />
}

export default App
