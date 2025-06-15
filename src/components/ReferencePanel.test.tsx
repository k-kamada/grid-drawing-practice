import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../test/test-utils'
import userEvent from '@testing-library/user-event'
import ReferencePanel from './ReferencePanel'

describe('ReferencePanel', () => {
  it('renders image upload when no image is selected', () => {
    render(<ReferencePanel />)
    
    expect(screen.getByText('画像を選択')).toBeInTheDocument()
    expect(screen.getByText(/ドラッグ&ドロップ/)).toBeInTheDocument()
  })

  it('renders image display when image is selected', async () => {
    render(<ReferencePanel />)
    
    const fileInput = screen.getByLabelText('画像ファイル選択')
    const mockFile = new File(['mock image'], 'test.jpg', { type: 'image/jpeg' })
    
    Object.defineProperty(URL, 'createObjectURL', {
      writable: true,
      value: vi.fn(() => 'mock-url')
    })
    
    await fireEvent.change(fileInput, { target: { files: [mockFile] } })
    
    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'お手本画像')
  })

  it('renders grid controls', () => {
    render(<ReferencePanel />)
    
    expect(screen.getByText('グリッド設定')).toBeInTheDocument()
    expect(screen.getByLabelText('グリッド表示')).toBeInTheDocument()
    expect(screen.getByLabelText('グリッドサイズ')).toBeInTheDocument()
  })

  it('toggles grid visibility', async () => {
    const user = userEvent.setup()
    render(<ReferencePanel />)
    
    const gridToggle = screen.getByLabelText('グリッド表示')
    expect(gridToggle).not.toBeChecked()
    
    await user.click(gridToggle)
    expect(gridToggle).toBeChecked()
  })

  it('updates grid size', async () => {
    const user = userEvent.setup()
    render(<ReferencePanel />)
    
    const gridSizeInput = screen.getByLabelText('グリッドサイズ')
    expect(gridSizeInput).toHaveValue(20)
    
    await user.clear(gridSizeInput)
    await user.type(gridSizeInput, '30')
    expect(gridSizeInput).toHaveValue(30)
  })

  it('shows grid overlay when image is present and grid is enabled', async () => {
    const user = userEvent.setup()
    render(<ReferencePanel />)
    
    const fileInput = screen.getByLabelText('画像ファイル選択')
    const mockFile = new File(['mock image'], 'test.jpg', { type: 'image/jpeg' })
    
    Object.defineProperty(URL, 'createObjectURL', {
      writable: true,
      value: vi.fn(() => 'mock-url')
    })
    
    await fireEvent.change(fileInput, { target: { files: [mockFile] } })
    
    const gridToggle = screen.getByLabelText('グリッド表示')
    await user.click(gridToggle)
    
    const container = screen.getByTestId('image-container')
    expect(container.querySelector('.grid-overlay')).toBeInTheDocument()
  })

  it('applies proper CSS classes', () => {
    const { container } = render(<ReferencePanel />)
    
    expect(container.firstChild).toHaveClass('reference-panel')
  })
})