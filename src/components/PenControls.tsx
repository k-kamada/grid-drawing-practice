import React from 'react'
import './PenControls.css'

interface PenControlsProps {
  penSize: number
  penColor: string
  onPenSizeChange: (size: number) => void
  onPenColorChange: (color: string) => void
}

const PenControls: React.FC<PenControlsProps> = ({
  penSize,
  penColor,
  onPenSizeChange,
  onPenColorChange
}) => {
  const presetSizes = [
    { label: '細', value: 2 },
    { label: '中', value: 5 },
    { label: '太', value: 10 }
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

  return (
    <div className="pen-controls">
      <h3>ペン設定</h3>
      
      <div className="pen-controls__section">
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

      <div className="pen-controls__section">
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
  )
}

export default PenControls