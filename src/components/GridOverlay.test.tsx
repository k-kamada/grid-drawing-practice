import { describe, it, expect } from 'vitest'
import { render, screen } from '../test/test-utils'
import GridOverlay from './GridOverlay'

describe('GridOverlay', () => {
  it('renders grid overlay when visible is true', () => {
    render(
      <GridOverlay 
        visible={true} 
        gridSize={20}
        lineWidth={1}
        color="#000000"
      />
    )
    
    const svg = screen.getByRole('img', { hidden: true })
    expect(svg).toBeInTheDocument()
  })

  it('does not render grid when visible is false', () => {
    render(
      <GridOverlay 
        visible={false} 
        gridSize={20}
        lineWidth={1}
        color="#000000"
      />
    )
    
    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument()
  })

  it('applies correct container class', () => {
    const { container } = render(
      <GridOverlay 
        visible={true} 
        gridSize={20}
        lineWidth={1}
        color="#000000"
      />
    )
    
    expect(container.firstChild).toHaveClass('grid-overlay')
  })

  it('generates grid lines with correct spacing', () => {
    render(
      <GridOverlay 
        visible={true} 
        gridSize={30}
        lineWidth={2}
        color="#ff0000"
      />
    )
    
    const svg = screen.getByRole('img', { hidden: true })
    const defs = svg.querySelector('defs')
    const pattern = defs?.querySelector('pattern')
    
    expect(pattern).toHaveAttribute('width', '30')
    expect(pattern).toHaveAttribute('height', '30')
  })

  it('applies correct line width and color', () => {
    render(
      <GridOverlay 
        visible={true} 
        gridSize={20}
        lineWidth={3}
        color="#00ff00"
      />
    )
    
    const svg = screen.getByRole('img', { hidden: true })
    const lines = svg.querySelectorAll('line')
    
    lines.forEach(line => {
      expect(line).toHaveAttribute('stroke', '#00ff00')
      expect(line).toHaveAttribute('stroke-width', '3')
    })
  })

  it('creates vertical and horizontal lines', () => {
    render(
      <GridOverlay 
        visible={true} 
        gridSize={20}
        lineWidth={1}
        color="#000000"
      />
    )
    
    const svg = screen.getByRole('img', { hidden: true })
    const lines = svg.querySelectorAll('line')
    
    expect(lines.length).toBeGreaterThan(0)
    
    const verticalLine = Array.from(lines).find(line => 
      line.getAttribute('x1') === line.getAttribute('x2')
    )
    const horizontalLine = Array.from(lines).find(line => 
      line.getAttribute('y1') === line.getAttribute('y2')
    )
    
    expect(verticalLine).toBeTruthy()
    expect(horizontalLine).toBeTruthy()
  })
})