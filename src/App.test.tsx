import { describe, it, expect } from 'vitest'
import { render, screen } from './test/test-utils'
import App from './App'

describe('App', () => {
  it('renders split layout with left and right panels', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'お手本表示エリア' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: '描画エリア' })).toBeInTheDocument()
  })

  it('renders reference panel in left area', () => {
    render(<App />)
    expect(screen.getByText('グリッド設定')).toBeInTheDocument()
    expect(screen.getByText('画像を選択')).toBeInTheDocument()
  })

  it('renders drawing panel in right area', () => {
    render(<App />)
    expect(screen.getByText('ペン設定')).toBeInTheDocument()
    expect(screen.getByText('クリア')).toBeInTheDocument()
  })
})