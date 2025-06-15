import { describe, it, expect } from 'vitest'
import { render, screen } from '../test/test-utils'
import ImageDisplay from './ImageDisplay'

describe('ImageDisplay', () => {
  const mockImageSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='

  it('renders image when imageSrc is provided', () => {
    render(<ImageDisplay imageSrc={mockImageSrc} />)
    
    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockImageSrc)
    expect(image).toHaveAttribute('alt', 'お手本画像')
  })

  it('renders placeholder when no imageSrc is provided', () => {
    render(<ImageDisplay imageSrc={null} />)
    
    expect(screen.getByText('画像が選択されていません')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders placeholder when imageSrc is empty string', () => {
    render(<ImageDisplay imageSrc="" />)
    
    expect(screen.getByText('画像が選択されていません')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('applies proper CSS class to container', () => {
    const { container } = render(<ImageDisplay imageSrc={mockImageSrc} />)
    
    expect(container.firstChild).toHaveClass('image-display')
  })

  it('applies responsive styling to image', () => {
    render(<ImageDisplay imageSrc={mockImageSrc} />)
    
    const image = screen.getByRole('img')
    expect(image).toHaveClass('image-display__image')
  })

  it('shows placeholder with proper styling', () => {
    render(<ImageDisplay imageSrc={null} />)
    
    const placeholder = screen.getByText('画像が選択されていません')
    expect(placeholder.parentElement).toHaveClass('image-display__placeholder')
  })
})