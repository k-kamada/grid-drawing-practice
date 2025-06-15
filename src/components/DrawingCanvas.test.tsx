import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../test/test-utils'
import DrawingCanvas from './DrawingCanvas'

// Mock HTMLCanvasElement and its methods
const mockGetContext = vi.fn()
const mockBeginPath = vi.fn()
const mockMoveTo = vi.fn()
const mockLineTo = vi.fn()
const mockStroke = vi.fn()
const mockClearRect = vi.fn()

beforeEach(() => {
  const mockContext = {
    beginPath: mockBeginPath,
    moveTo: mockMoveTo,
    lineTo: mockLineTo,
    stroke: mockStroke,
    clearRect: mockClearRect,
    strokeStyle: '#000000',
    lineWidth: 2,
    lineCap: 'round',
    lineJoin: 'round',
  }
  
  mockGetContext.mockReturnValue(mockContext)
  
  HTMLCanvasElement.prototype.getContext = mockGetContext
  HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn(() => ({
    left: 0,
    top: 0,
    width: 800,
    height: 600,
  }))
  
  // Canvas width/height プロパティをモック
  Object.defineProperty(HTMLCanvasElement.prototype, 'width', {
    get: () => 800,
    configurable: true
  })
  Object.defineProperty(HTMLCanvasElement.prototype, 'height', {
    get: () => 600,
    configurable: true
  })
  
  // Clear mock calls
  mockBeginPath.mockClear()
  mockMoveTo.mockClear()
  mockLineTo.mockClear()
  mockStroke.mockClear()
  mockClearRect.mockClear()
})

describe('DrawingCanvas', () => {
  const defaultProps = {
    penSize: 2,
    penColor: '#000000',
    onClear: vi.fn(),
  }

  it('renders canvas element', () => {
    render(<DrawingCanvas {...defaultProps} />)
    
    const canvas = screen.getByRole('img', { hidden: true })
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveAttribute('width')
    expect(canvas).toHaveAttribute('height')
  })

  it('applies proper CSS class to container', () => {
    const { container } = render(<DrawingCanvas {...defaultProps} />)
    
    expect(container.firstChild).toHaveClass('drawing-canvas')
  })

  it('renders clear button', () => {
    render(<DrawingCanvas {...defaultProps} />)
    
    expect(screen.getByText('クリア')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onClear when clear button is clicked', async () => {
    const mockOnClear = vi.fn()
    render(<DrawingCanvas {...defaultProps} onClear={mockOnClear} />)
    
    const clearButton = screen.getByText('クリア')
    fireEvent.click(clearButton)
    
    expect(mockOnClear).toHaveBeenCalled()
  })

  it('clears canvas when clear button is clicked', async () => {
    render(<DrawingCanvas {...defaultProps} />)
    
    const clearButton = screen.getByText('クリア')
    fireEvent.click(clearButton)
    
    expect(mockClearRect).toHaveBeenCalled()
  })

  it('starts drawing on mouse down', () => {
    render(<DrawingCanvas {...defaultProps} />)
    
    const canvas = screen.getByRole('img', { hidden: true })
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 })
    
    expect(mockBeginPath).toHaveBeenCalled()
    expect(mockMoveTo).toHaveBeenCalledWith(100, 100)
  })

  it('draws line on mouse move when drawing', () => {
    render(<DrawingCanvas {...defaultProps} />)
    
    const canvas = screen.getByRole('img', { hidden: true })
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 })
    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 })
    
    expect(mockLineTo).toHaveBeenCalledWith(150, 150)
    expect(mockStroke).toHaveBeenCalled()
  })

  it('stops drawing on mouse up', () => {
    render(<DrawingCanvas {...defaultProps} />)
    
    const canvas = screen.getByRole('img', { hidden: true })
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 })
    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 })
    fireEvent.mouseUp(canvas)
    
    // After mouse up, mouse move should not draw
    fireEvent.mouseMove(canvas, { clientX: 200, clientY: 200 })
    
    // LineTo should only have been called once (during the first move)
    expect(mockLineTo).toHaveBeenCalledTimes(1)
  })

  it('applies pen size and color to context', () => {
    const mockContext = {
      beginPath: mockBeginPath,
      moveTo: mockMoveTo,
      lineTo: mockLineTo,
      stroke: mockStroke,
      clearRect: mockClearRect,
      strokeStyle: '#000000',
      lineWidth: 2,
      lineCap: 'round',
      lineJoin: 'round',
    }
    
    mockGetContext.mockReturnValue(mockContext)
    
    render(<DrawingCanvas penSize={5} penColor="#ff0000" onClear={vi.fn()} />)
    
    // Check that properties were set
    expect(mockContext.lineWidth).toBe(5)
    expect(mockContext.strokeStyle).toBe('#ff0000')
  })

  it('handles canvas scaling correctly', () => {
    // Mock smaller display size (scaled canvas)
    HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      width: 400, // Half the canvas width
      height: 300, // Half the canvas height
    }))
    
    render(<DrawingCanvas {...defaultProps} />)
    
    const canvas = screen.getByRole('img', { hidden: true })
    
    // Click at display position (100, 100)
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 })
    
    // Should be scaled to internal position (200, 200)
    expect(mockMoveTo).toHaveBeenCalledWith(200, 200)
  })
})