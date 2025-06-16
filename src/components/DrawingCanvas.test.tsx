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
const mockScale = vi.fn()

beforeEach(() => {
  const mockContext = {
    beginPath: mockBeginPath,
    moveTo: mockMoveTo,
    lineTo: mockLineTo,
    stroke: mockStroke,
    clearRect: mockClearRect,
    scale: mockScale,
    strokeStyle: '#000000',
    lineWidth: 2,
    lineCap: 'round',
    lineJoin: 'round',
    imageSmoothingEnabled: true,
  }
  
  mockGetContext.mockReturnValue(mockContext)
  
  HTMLCanvasElement.prototype.getContext = mockGetContext
  HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn(() => ({
    left: 0,
    top: 0,
    width: 800,
    height: 600,
    right: 800,
    bottom: 600,
    x: 0,
    y: 0,
    toJSON: () => ({})
  } as DOMRect))
  
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
    penSize: 1,
    penColor: '#000000',
    gridVisible: false,
    gridSize: 20,
    gridLineWidth: 1,
    gridColor: '#ddd',
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

  it('provides clearCanvas method through ref', () => {
    let canvasRef: any = null
    
    const TestComponent = () => (
      <DrawingCanvas 
        {...defaultProps} 
        ref={(ref) => { canvasRef = ref }}
      />
    )
    
    render(<TestComponent />)
    
    expect(canvasRef).toBeTruthy()
    expect(typeof canvasRef.clearCanvas).toBe('function')
    expect(typeof canvasRef.saveAsPNG).toBe('function')
  })

  it('clears canvas and strokes when clearCanvas is called through ref', () => {
    let canvasRef: any = null
    
    const TestComponent = () => (
      <DrawingCanvas 
        {...defaultProps} 
        ref={(ref) => { canvasRef = ref }}
      />
    )
    
    render(<TestComponent />)
    
    // Clear canvas through ref
    canvasRef.clearCanvas()
    
    expect(mockClearRect).toHaveBeenCalledWith(0, 0, 800, 600)
  })

  it('starts drawing on mouse down', () => {
    render(<DrawingCanvas {...defaultProps} />)
    
    const canvas = screen.getByRole('img', { hidden: true })
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 })
    
    // ストローク方式では初回描画はmousemoveで発生するため、mousedownでは描画されない
    expect(mockBeginPath).not.toHaveBeenCalled()
    expect(mockMoveTo).not.toHaveBeenCalled()
  })

  it('draws line on mouse move when drawing', () => {
    render(<DrawingCanvas {...defaultProps} />)
    
    const canvas = screen.getByRole('img', { hidden: true })
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 })
    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 })
    
    // ストローク方式では初回移動で線分描画が開始される
    expect(mockBeginPath).toHaveBeenCalled()
    expect(mockMoveTo).toHaveBeenCalledWith(100, 100)
    expect(mockLineTo).toHaveBeenCalledWith(150, 150)
    expect(mockStroke).toHaveBeenCalled()
  })

  it('stops drawing on mouse up', () => {
    render(<DrawingCanvas {...defaultProps} />)
    
    const canvas = screen.getByRole('img', { hidden: true })
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 })
    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 })
    fireEvent.mouseUp(canvas)
    
    // Clear previous calls to check mouse up behavior
    mockBeginPath.mockClear()
    mockMoveTo.mockClear()
    mockLineTo.mockClear()
    mockStroke.mockClear()
    
    // After mouse up, mouse move should not draw
    fireEvent.mouseMove(canvas, { clientX: 200, clientY: 200 })
    
    // No additional drawing should occur after mouse up
    expect(mockBeginPath).not.toHaveBeenCalled()
    expect(mockMoveTo).not.toHaveBeenCalled()
    expect(mockLineTo).not.toHaveBeenCalled()
    expect(mockStroke).not.toHaveBeenCalled()
  })

  it('applies pen size and color to context', () => {
    const mockContext = {
      beginPath: mockBeginPath,
      moveTo: mockMoveTo,
      lineTo: mockLineTo,
      stroke: mockStroke,
      clearRect: mockClearRect,
      scale: mockScale,
      strokeStyle: '#000000',
      lineWidth: 1,
      lineCap: 'round',
      lineJoin: 'round',
      imageSmoothingEnabled: true,
    }
    
    mockGetContext.mockReturnValue(mockContext)
    
    render(<DrawingCanvas {...defaultProps} penSize={3} penColor="#ff0000" />)
    
    // Check that properties were set
    expect(mockContext.lineWidth).toBe(3)
    expect(mockContext.strokeStyle).toBe('#ff0000')
  })

  it('handles canvas scaling correctly', () => {
    // Mock smaller display size (scaled canvas)
    HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      width: 400, // Half the canvas width
      height: 300, // Half the canvas height
      right: 400,
      bottom: 300,
      x: 0,
      y: 0,
      toJSON: () => ({})
    } as DOMRect))
    
    render(<DrawingCanvas {...defaultProps} />)
    
    const canvas = screen.getByRole('img', { hidden: true })
    
    // ストローク方式では描画はmousemoveで開始されるため、2回のイベントを発生
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 })
    fireEvent.mouseMove(canvas, { clientX: 100, clientY: 100 })
    
    // Should use direct canvas coordinates (100, 100)
    expect(mockMoveTo).toHaveBeenCalledWith(100, 100)
  })

  it('renders overlay image when overlay is visible', () => {
    render(
      <DrawingCanvas 
        {...defaultProps} 
        overlayVisible={true}
        referenceImageSrc="test-image.jpg"
      />
    )
    
    const overlayImage = screen.getByAltText('重ね合わせ画像')
    expect(overlayImage).toBeInTheDocument()
    expect(overlayImage).toHaveAttribute('src', 'test-image.jpg')
  })

  it('does not render overlay image when overlay is not visible', () => {
    render(
      <DrawingCanvas 
        {...defaultProps} 
        overlayVisible={false}
        referenceImageSrc="test-image.jpg"
      />
    )
    
    const overlayImage = screen.queryByAltText('重ね合わせ画像')
    expect(overlayImage).not.toBeInTheDocument()
  })

  it('does not render overlay image when no reference image is provided', () => {
    render(
      <DrawingCanvas 
        {...defaultProps} 
        overlayVisible={true}
        referenceImageSrc={null}
      />
    )
    
    const overlayImage = screen.queryByAltText('重ね合わせ画像')
    expect(overlayImage).not.toBeInTheDocument()
  })

  it('saves canvas as PNG when saveAsPNG is called through ref', () => {
    let canvasRef: any = null
    
    const TestComponent = () => (
      <DrawingCanvas 
        {...defaultProps} 
        ref={(ref) => { canvasRef = ref }}
      />
    )
    
    render(<TestComponent />)
    
    // Mock Canvas toDataURL after render
    const mockToDataURL = vi.fn(() => 'data:image/png;base64,mockdata')
    HTMLCanvasElement.prototype.toDataURL = mockToDataURL
    
    // Mock link element with all required properties
    const mockLink = {
      download: '',
      href: '',
      click: vi.fn(),
      style: {}
    }
    
    // Mock document methods after render
    const originalCreateElement = document.createElement
    const originalAppendChild = document.body.appendChild
    const originalRemoveChild = document.body.removeChild
    
    document.createElement = vi.fn(() => mockLink) as any
    document.body.appendChild = vi.fn() as any
    document.body.removeChild = vi.fn() as any
    
    // Call saveAsPNG through ref
    canvasRef.saveAsPNG()
    
    // Verify the mock was called correctly
    expect(mockToDataURL).toHaveBeenCalledWith('image/png')
    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(mockLink.href).toBe('data:image/png;base64,mockdata')
    expect(mockLink.download).toMatch(/^drawing_\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.png$/)
    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink)
    expect(mockLink.click).toHaveBeenCalled()
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink)
    
    // Restore original methods
    document.createElement = originalCreateElement
    document.body.appendChild = originalAppendChild
    document.body.removeChild = originalRemoveChild
  })
})