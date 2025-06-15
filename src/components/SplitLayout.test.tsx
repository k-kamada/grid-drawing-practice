import { describe, it, expect } from 'vitest'
import { render, screen } from '../test/test-utils'
import SplitLayout from './SplitLayout'

describe('SplitLayout', () => {
  it('renders left and right content areas', () => {
    render(
      <SplitLayout
        leftContent={<div data-testid="left-content">Left Panel</div>}
        rightContent={<div data-testid="right-content">Right Panel</div>}
      />
    )

    expect(screen.getByTestId('left-content')).toBeInTheDocument()
    expect(screen.getByTestId('right-content')).toBeInTheDocument()
  })

  it('applies proper CSS classes for split layout', () => {
    render(
      <SplitLayout
        leftContent={<div>Left</div>}
        rightContent={<div>Right</div>}
      />
    )

    const container = screen.getByRole('main')
    expect(container).toHaveClass('split-layout')
  })

  it('renders with proper accessibility attributes', () => {
    render(
      <SplitLayout
        leftContent={<div>Left</div>}
        rightContent={<div>Right</div>}
      />
    )

    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})