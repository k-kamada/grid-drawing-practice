import SplitLayout from './components/SplitLayout'
import './App.css'

function App() {
  const leftContent = (
    <div>
      <h2>お手本表示パネル</h2>
      <p>ここにお手本画像が表示されますの</p>
    </div>
  )

  const rightContent = (
    <div>
      <h2>描画パネル</h2>
      <p>ここで模写練習を行いますの</p>
    </div>
  )

  return <SplitLayout leftContent={leftContent} rightContent={rightContent} />
}

export default App
