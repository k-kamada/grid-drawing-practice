import React from 'react'
import './SplitLayout.css'

interface SplitLayoutProps {
  leftContent: React.ReactNode
  rightContent: React.ReactNode
}

const SplitLayout: React.FC<SplitLayoutProps> = ({ leftContent, rightContent }) => {
  return (
    <main className="split-layout" role="main">
      <div className="split-layout__left" role="region" aria-label="お手本表示エリア">
        {leftContent}
      </div>
      <div className="split-layout__right" role="region" aria-label="描画エリア">
        {rightContent}
      </div>
    </main>
  )
}

export default SplitLayout