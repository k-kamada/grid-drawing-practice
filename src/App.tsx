import SplitLayout from './components/SplitLayout'
import ReferencePanel from './components/ReferencePanel'
import DrawingPanel from './components/DrawingPanel'
import './App.css'

function App() {
  const leftContent = <ReferencePanel />
  const rightContent = <DrawingPanel />

  return <SplitLayout leftContent={leftContent} rightContent={rightContent} />
}

export default App
