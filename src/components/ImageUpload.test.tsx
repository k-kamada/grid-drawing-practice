import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../test/test-utils'
import userEvent from '@testing-library/user-event'
import ImageUpload from './ImageUpload'

describe('ImageUpload', () => {
  it('renders upload button', () => {
    const mockOnImageSelect = vi.fn()
    render(<ImageUpload onImageSelect={mockOnImageSelect} />)
    
    expect(screen.getByText('画像を選択')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders file input with proper attributes', () => {
    const mockOnImageSelect = vi.fn()
    render(<ImageUpload onImageSelect={mockOnImageSelect} />)
    
    const fileInput = screen.getByLabelText('画像ファイル選択')
    expect(fileInput).toBeInTheDocument()
    expect(fileInput).toHaveAttribute('type', 'file')
    expect(fileInput).toHaveAttribute('accept', 'image/*')
  })

  it('triggers file input when button is clicked', async () => {
    const mockOnImageSelect = vi.fn()
    const user = userEvent.setup()
    render(<ImageUpload onImageSelect={mockOnImageSelect} />)
    
    const button = screen.getByRole('button')
    const fileInput = screen.getByLabelText('画像ファイル選択')
    
    const clickSpy = vi.spyOn(fileInput, 'click')
    await user.click(button)
    
    expect(clickSpy).toHaveBeenCalled()
  })

  it('calls onImageSelect when valid image file is selected', async () => {
    const mockOnImageSelect = vi.fn()
    render(<ImageUpload onImageSelect={mockOnImageSelect} />)
    
    const fileInput = screen.getByLabelText('画像ファイル選択')
    const mockFile = new File(['mock image'], 'test.jpg', { type: 'image/jpeg' })
    
    await fireEvent.change(fileInput, { target: { files: [mockFile] } })
    
    expect(mockOnImageSelect).toHaveBeenCalledWith(mockFile)
  })

  it('shows drag and drop area', () => {
    const mockOnImageSelect = vi.fn()
    render(<ImageUpload onImageSelect={mockOnImageSelect} />)
    
    expect(screen.getByText(/ドラッグ&ドロップ/)).toBeInTheDocument()
  })
})