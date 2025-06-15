import SplitLayout from './components/SplitLayout'
import ReferencePanel from './components/ReferencePanel'
import './App.css'

function App() {
  const leftContent = <ReferencePanel />

  const rightContent = (
    <div>
      <h2>描画パネル</h2>
      <p>ここで模写練習を行いますの</p>
    </div>
  )

  return <SplitLayout leftContent={leftContent} rightContent={rightContent} />
}

export default App
