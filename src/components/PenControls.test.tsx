import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../test/test-utils'
import userEvent from '@testing-library/user-event'
import PenControls from './PenControls'

describe('PenControls', () => {
  const defaultProps = {
    penSize: 2,
    penColor: '#000000',
    onPenSizeChange: vi.fn(),
    onPenColorChange: vi.fn(),
  }

  it('renders pen size control', () => {
    render(<PenControls {...defaultProps} />)
    
    expect(screen.getByText('ペン設定')).toBeInTheDocument()
    expect(screen.getByLabelText('ペンの太さ')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2')).toBeInTheDocument()
  })

  it('renders pen color control', () => {
    render(<PenControls {...defaultProps} />)
    
    expect(screen.getByLabelText('ペンの色')).toBeInTheDocument()
    expect(screen.getByDisplayValue('#000000')).toBeInTheDocument()
  })

  it('displays current pen size value', () => {
    render(<PenControls {...defaultProps} penSize={5} />)
    
    expect(screen.getByDisplayValue('5')).toBeInTheDocument()
    expect(screen.getByText('5px')).toBeInTheDocument()
  })

  it('displays current pen color value', () => {
    render(<PenControls {...defaultProps} penColor="#ff0000" />)
    
    const colorInput = screen.getByLabelText('ペンの色') as HTMLInputElement
    expect(colorInput.value).toBe('#ff0000')
  })

  it('calls onPenSizeChange when pen size input changes', () => {
    const mockOnPenSizeChange = vi.fn()
    
    render(<PenControls {...defaultProps} onPenSizeChange={mockOnPenSizeChange} />)
    
    const sizeInput = screen.getByLabelText('ペンの太さ')
    
    fireEvent.change(sizeInput, { target: { value: '10' } })
    
    expect(mockOnPenSizeChange).toHaveBeenCalledWith(10)
  })

  it('calls onPenColorChange when color input changes', () => {
    const mockOnPenColorChange = vi.fn()
    
    render(<PenControls {...defaultProps} onPenColorChange={mockOnPenColorChange} />)
    
    const colorInput = screen.getByLabelText('ペンの色')
    
    fireEvent.change(colorInput, { target: { value: '#ff0000' } })
    
    expect(mockOnPenColorChange).toHaveBeenCalledWith('#ff0000')
  })

  it('renders preset pen sizes', () => {
    render(<PenControls {...defaultProps} />)
    
    expect(screen.getByText('細')).toBeInTheDocument()
    expect(screen.getByText('中')).toBeInTheDocument()
    expect(screen.getByText('太')).toBeInTheDocument()
  })

  it('selects preset pen size when clicked', async () => {
    const mockOnPenSizeChange = vi.fn()
    const user = userEvent.setup()
    
    render(<PenControls {...defaultProps} onPenSizeChange={mockOnPenSizeChange} />)
    
    const mediumButton = screen.getByText('中')
    await user.click(mediumButton)
    
    expect(mockOnPenSizeChange).toHaveBeenCalledWith(5)
  })

  it('highlights active preset size', () => {
    render(<PenControls {...defaultProps} penSize={5} />)
    
    const mediumButton = screen.getByText('中')
    expect(mediumButton).toHaveClass('pen-controls__preset-button--active')
  })

  it('validates pen size range', async () => {
    const mockOnPenSizeChange = vi.fn()
    const user = userEvent.setup()
    
    render(<PenControls {...defaultProps} onPenSizeChange={mockOnPenSizeChange} />)
    
    const sizeInput = screen.getByLabelText('ペンの太さ')
    
    // Test minimum value
    await user.clear(sizeInput)
    await user.type(sizeInput, '0')
    expect(mockOnPenSizeChange).not.toHaveBeenCalledWith(0)
    
    // Test maximum value
    await user.clear(sizeInput)
    await user.type(sizeInput, '101')
    expect(mockOnPenSizeChange).not.toHaveBeenCalledWith(101)
  })

  it('applies proper CSS classes', () => {
    const { container } = render(<PenControls {...defaultProps} />)
    
    expect(container.firstChild).toHaveClass('pen-controls')
  })
})