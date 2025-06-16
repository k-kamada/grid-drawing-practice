import React from 'react'
import './PenControls.css'

interface PenControlsProps {
  penSize: number
  penColor: string
  onPenSizeChange: (size: number) => void
  onPenColorChange: (color: string) => void
  onClear: () => void
  onSave: () => void
  overlayVisible?: boolean
  onOverlayToggle?: (visible: boolean) => void
}

const PenControls: React.FC<PenControlsProps> = ({
  penSize,
  penColor,
  onPenSizeChange,
  onPenColorChange,
  onClear,
  onSave,
  overlayVisible = false,
  onOverlayToggle
}) => {
  const presetSizes = [
    { label: '細', value: 1 },
    { label: '中', value: 2 },
    { label: '太', value: 3 }
  ]

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Number(event.target.value)
    if (newSize >= 1 && newSize <= 100) {
      onPenSizeChange(newSize)
    }
  }

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPenColorChange(event.target.value)
  }

  const handlePresetClick = (size: number) => {
    onPenSizeChange(size)
  }

  const handleOverlayToggle = () => {
    if (onOverlayToggle) {
      onOverlayToggle(!overlayVisible)
    }
  }

  return (
    <div className="pen-controls">
      <h3>ペン設定</h3>
      
      <div className="pen-controls__layout">
        <div className="pen-controls__size-section">
          <div className="pen-controls__control-group">
            <label htmlFor="pen-size">
              ペンの太さ: <span className="pen-controls__size-value">{penSize}px</span>
            </label>
            <input
              id="pen-size"
              type="number"
              min="1"
              max="100"
              value={penSize}
              onChange={handleSizeChange}
              className="pen-controls__size-input"
              aria-label="ペンの太さ"
            />
          </div>

          <div className="pen-controls__presets">
            {presetSizes.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => handlePresetClick(value)}
                className={`pen-controls__preset-button ${
                  penSize === value ? 'pen-controls__preset-button--active' : ''
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="pen-controls__color-section">
          <div className="pen-controls__control-group">
            <label htmlFor="pen-color">ペンの色:</label>
            <input
              id="pen-color"
              type="color"
              value={penColor}
              onChange={handleColorChange}
              className="pen-controls__color-input"
              aria-label="ペンの色"
            />
          </div>
        </div>
      </div>
      
      {onOverlayToggle && (
        <button
          type="button"
          onClick={handleOverlayToggle}
          className={`pen-controls__overlay-button ${overlayVisible ? 'pen-controls__overlay-button--active' : ''}`}
          aria-label="重ね合わせ切り替え"
        >
          重ね合わせ {overlayVisible ? 'ON' : 'OFF'}
        </button>
      )}
      
      <button
        type="button"
        onClick={onSave}
        className="pen-controls__save-button"
      >
        保存
      </button>
      
      <button
        type="button"
        onClick={onClear}
        className="pen-controls__clear-button"
      >
        クリア
      </button>
    </div>
  )
}

export default PenControls