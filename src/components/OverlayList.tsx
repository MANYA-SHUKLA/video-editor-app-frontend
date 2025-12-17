'use client'

import { Overlay } from '@/types'
import { Trash2, Type, Image as ImageIcon, Video, Clock, Move, Palette } from 'lucide-react'
import '@/styles/components/OverlayList.css'

interface OverlayListProps {
  overlays: Overlay[]
  selectedOverlay: string | null
  onSelectOverlay: (id: string) => void
  onAddOverlay: (type: 'text' | 'image' | 'video') => void
  onRemoveOverlay: (id: string) => void
  onUpdateOverlay: (id: string, updates: Partial<Overlay>) => void
  currentTime: number
  duration: number
}

const OverlayList = ({
  overlays,
  selectedOverlay,
  onSelectOverlay,
  onAddOverlay,
  onRemoveOverlay,
  onUpdateOverlay,
  currentTime,
  duration,
}: OverlayListProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getOverlayIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type className="overlay-type-icon" />
      case 'image': return <ImageIcon className="overlay-type-icon" />
      case 'video': return <Video className="overlay-type-icon" />
      default: return <Move className="overlay-type-icon" />
    }
  }

  return (
    <div className="overlay-list-container">
      <div className="overlay-header">
        <h3 className="overlay-header-title">Overlays</h3>
        <p className="overlay-header-subtitle">Add and manage overlays on your video</p>
      </div>

      <div className="overlay-content">
        <div className="add-overlay-section">
          <div className="add-button-group">
            <button
              onClick={() => onAddOverlay('text')}
              className="add-overlay-button text-overlay-button"
            >
              <Type className="add-button-icon" />
              <span className="add-button-text">Add Text</span>
            </button>
            <button
              onClick={() => onAddOverlay('image')}
              className="add-overlay-button image-overlay-button"
            >
              <ImageIcon className="add-button-icon" />
              <span className="add-button-text">Add Image</span>
            </button>
            <button
              onClick={() => onAddOverlay('video')}
              className="add-overlay-button video-overlay-button"
            >
              <Video className="add-button-icon" />
              <span className="add-button-text">Add Video</span>
            </button>
          </div>
        </div>
        <div className="overlays-list-section">
          {overlays.length === 0 ? (
            <div className="overlay-empty-state">
              <div className="overlay-empty-icon">
                <Move size={48} />
              </div>
              <p className="overlay-empty-text">
                No overlays added yet. Click buttons above to add text, images, or videos.
              </p>
            </div>
          ) : (
            <div className="overlays-list">
              {overlays.map((overlay) => {
                const isSelected = selectedOverlay === overlay.id
                const isActive = currentTime >= overlay.startTime && currentTime <= overlay.endTime

                return (
                  <div
                    key={overlay.id}
                    className={`overlay-item-card ${isSelected ? 'overlay-item-selected' : ''}`}
                    onClick={() => onSelectOverlay(overlay.id)}
                  >
                    <div className="overlay-item-header">
                      <div className="overlay-item-title">
                        <div className="overlay-type-icon-wrapper">
                          {getOverlayIcon(overlay.type)}
                        </div>
                        <div>
                          <div className="overlay-name">
                            {overlay.type === 'text' 
                              ? overlay.content.substring(0, 20) + (overlay.content.length > 20 ? '...' : '')
                              : `${overlay.type.charAt(0).toUpperCase() + overlay.type.slice(1)} Overlay`
                            }
                          </div>
                          <div className={`overlay-status ${isActive ? 'overlay-status-active' : 'overlay-status-inactive'}`}>
                            {isActive ? '● Active' : '○ Inactive'}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemoveOverlay(overlay.id)
                        }}
                        className="overlay-delete-button"
                        aria-label="Delete overlay"
                      >
                        <Trash2 className="delete-button-icon" />
                      </button>
                    </div>

                    {isSelected && (
                      <div className="overlay-properties">
                        {overlay.type === 'text' && (
                          <div className="property-row">
                            <label className="property-label">Text Content</label>
                            <input
                              type="text"
                              value={overlay.content}
                              onChange={(e) => onUpdateOverlay(overlay.id, { content: e.target.value })}
                              className="property-input text-input"
                              placeholder="Enter text..."
                            />
                          </div>
                        )}
                        <div className="property-row">
                          <label className="property-label">Position</label>
                          <div className="position-controls">
                            <div className="position-control-group">
                              <span className="position-label">X:</span>
                              <input
                                type="number"
                                value={Math.round(overlay.x)}
                                onChange={(e) => onUpdateOverlay(overlay.id, { x: parseFloat(e.target.value) })}
                                className="position-input"
                                min="0"
                                max="100"
                              />
                              <span className="position-unit">%</span>
                            </div>
                            <div className="position-control-group">
                              <span className="position-label">Y:</span>
                              <input
                                type="number"
                                value={Math.round(overlay.y)}
                                onChange={(e) => onUpdateOverlay(overlay.id, { y: parseFloat(e.target.value) })}
                                className="position-input"
                                min="0"
                                max="100"
                              />
                              <span className="position-unit">%</span>
                            </div>
                          </div>
                        </div>
                        <div className="property-row">
                          <label className="property-label">Size</label>
                          <div className="size-controls">
                            <div className="size-control-group">
                              <span className="size-label">W:</span>
                              <input
                                type="number"
                                value={Math.round(overlay.width)}
                                onChange={(e) => onUpdateOverlay(overlay.id, { width: parseFloat(e.target.value) })}
                                className="size-input"
                                min="20"
                              />
                              <span className="size-unit">px</span>
                            </div>
                            <div className="size-control-group">
                              <span className="size-label">H:</span>
                              <input
                                type="number"
                                value={Math.round(overlay.height)}
                                onChange={(e) => onUpdateOverlay(overlay.id, { height: parseFloat(e.target.value) })}
                                className="size-input"
                                min="20"
                              />
                              <span className="size-unit">px</span>
                            </div>
                          </div>
                        </div>
                        <div className="property-row">
                          <label className="property-label">
                            <Clock className="property-label-icon" />
                            Timing
                          </label>
                          <div className="timing-controls">
                            <div className="timing-control-group">
                              <span className="timing-label">Start:</span>
                              <div className="timing-value-display">
                                {formatTime(overlay.startTime)}
                              </div>
                              <input
                                type="range"
                                min="0"
                                max={Math.max(overlay.endTime, duration || 0)}
                                value={overlay.startTime}
                                onChange={(e) => onUpdateOverlay(overlay.id, { startTime: parseFloat(e.target.value) })}
                                className="timing-slider"
                              />
                            </div>
                            <div className="timing-control-group">
                              <span className="timing-label">End:</span>
                              <div className="timing-value-display">
                                {formatTime(overlay.endTime)}
                              </div>
                              <input
                                type="range"
                                min={overlay.startTime}
                                max={duration || 0}
                                value={overlay.endTime}
                                onChange={(e) => onUpdateOverlay(overlay.id, { endTime: parseFloat(e.target.value) })}
                                className="timing-slider"
                              />
                            </div>
                          </div>
                        </div>
                        {overlay.type === 'text' && (
                          <>
                            <div className="property-row">
                              <label className="property-label">Font Size</label>
                              <div className="font-size-controls">
                                <input
                                  type="range"
                                  min="12"
                                  max="72"
                                  value={overlay.fontSize || 24}
                                  onChange={(e) => onUpdateOverlay(overlay.id, { fontSize: parseFloat(e.target.value) })}
                                  className="font-size-slider"
                                />
                                <div className="font-size-value">
                                  {overlay.fontSize || 24}px
                                </div>
                              </div>
                            </div>

                            <div className="property-row">
                              <label className="property-label">
                                <Palette className="property-label-icon" />
                                Colors
                              </label>
                              <div className="color-controls">
                                <div className="color-control-group">
                                  <label className="color-label">Text:</label>
                                  <input
                                    type="color"
                                    value={overlay.fontColor || '#FFFFFF'}
                                    onChange={(e) => onUpdateOverlay(overlay.id, { fontColor: e.target.value })}
                                    className="color-picker"
                                  />
                                </div>
                                <div className="color-control-group">
                                  <label className="color-label">BG:</label>
                                  <input
                                    type="color"
                                    value={overlay.backgroundColor || '#000000'}
                                    onChange={(e) => onUpdateOverlay(overlay.id, { backgroundColor: e.target.value })}
                                    className="color-picker"
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OverlayList