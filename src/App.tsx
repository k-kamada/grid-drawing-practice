import { useState } from 'react'
import SplitLayout from './components/SplitLayout'
import ReferencePanel from './components/ReferencePanel'
import DrawingPanel from './components/DrawingPanel'
import type { Size } from './types/drawing'
import './App.css'

function App() {
  const [gridVisible, setGridVisible] = useState(false)
  const [gridSize, setGridSize] = useState(20)
  const [gridLineWidth] = useState(1)
  const [gridColor] = useState('#000000')
  const [imageSize, setImageSize] = useState<Size | null>(null)

  const leftContent = (
    <ReferencePanel 
      gridVisible={gridVisible}
      gridSize={gridSize}
      gridLineWidth={gridLineWidth}
      gridColor={gridColor}
      onGridVisibleChange={setGridVisible}
      onGridSizeChange={setGridSize}
      onImageDimensionsChange={setImageSize}
    />
  )
  
  const rightContent = (
    <DrawingPanel 
      gridVisible={gridVisible}
      gridSize={gridSize}
      gridLineWidth={gridLineWidth}
      gridColor={gridColor}
      imageSize={imageSize}
    />
  )

  return <SplitLayout leftContent={leftContent} rightContent={rightContent} />
}

export default App
