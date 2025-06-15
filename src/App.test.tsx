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

  it('renders placeholder content in panels', () => {
    render(<App />)
    expect(screen.getByText('お手本表示パネル')).toBeInTheDocument()
    expect(screen.getByText('描画パネル')).toBeInTheDocument()
  })
})