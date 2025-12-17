'use client'

import { useState } from 'react'
import { Overlay } from '@/types'
import { Play, Pause, ZoomIn, ZoomOut, Clock } from 'lucide-react'
import '@/styles/components/Timeline.css'

interface TimelineProps {
  duration: number
  currentTime: number
  overlays: Overlay[]
  onSeek: (time: number) => void
  selectedOverlay: string | null
  onSelectOverlay: (id: string) => void
}

const Timeline = ({
  duration,
  currentTime,
  overlays,
  onSeek,
  selectedOverlay,
  onSelectOverlay,
}: TimelineProps) => {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [visibleStart, setVisibleStart] = useState(0)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  const visibleDuration = duration / zoomLevel
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    const time = visibleStart + (percentage * visibleDuration)
    onSeek(Math.max(0, Math.min(time, duration)))
    }
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 10))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 1))
  }
  const getOverlayColor = (type: string) => {
    switch (type) {
      case 'text': return '#3b82f6' // Blue
      case 'image': return '#f59e0b' // Orange
      case 'video': return '#8b5cf6' // Purple
      default: return '#6b7280'
    }
  }
  const calculateOverlayPosition = (overlay: Overlay) => {
    const startPercent = ((overlay.startTime - visibleStart) / visibleDuration) * 100
    const widthPercent = ((overlay.endTime - overlay.startTime) / visibleDuration) * 100
    return {
      left: `${Math.max(0, startPercent)}%`,
      width: `${Math.min(widthPercent, 100 - Math.max(0, startPercent))}%`
    }
  }
  const generateTimeMarkers = () => {
    const markers = []
    const markerInterval = Math.max(1, Math.floor(visibleDuration / 10))
    
    for (let i = 0; i <= visibleDuration; i += markerInterval) {
      const time = visibleStart + i
      if (time <= duration) {
        const position = ((time - visibleStart) / visibleDuration) * 100
        markers.push({
          time: formatTime(time),
          position: `${position}%`
        })
      }
    }
    
    return markers
  }

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <div className="timeline-title-section">
          <Clock className="timeline-title-icon" />
          <h3 className="timeline-title">Timeline</h3>
          <span className="timeline-duration">{formatTime(duration)}</span>
        </div>
        
        <div className="timeline-controls">
          <div className="zoom-controls">
            <button
              onClick={handleZoomOut}
              className="zoom-button zoom-out-button"
              disabled={zoomLevel <= 1}
              aria-label="Zoom out"
            >
              <ZoomOut className="zoom-button-icon" />
            </button>
            <span className="zoom-level">{(zoomLevel * 100).toFixed(0)}%</span>
            <button
              onClick={handleZoomIn}
              className="zoom-button zoom-in-button"
              disabled={zoomLevel >= 10}
              aria-label="Zoom in"
            >
              <ZoomIn className="zoom-button-icon" />
            </button>
          </div>
        </div>
      </div>

      <div className="timeline-main">
        <div className="time-ruler">
          {generateTimeMarkers().map((marker, index) => (
            <div
              key={index}
              className="time-marker"
              style={{ left: marker.position }}
            >
              <div className="time-marker-line" />
              <span className="time-marker-label">{marker.time}</span>
            </div>
          ))}
        </div>


        <div 
          className="timeline-track"
          onClick={handleTimelineClick}
        >
\
          <div 
            className="current-time-indicator"
            style={{ left: `${((currentTime - visibleStart) / visibleDuration) * 100}%` }}
          >
            <div className="current-time-line" />
            <div className="current-time-tooltip">
              {formatTime(currentTime)}
            </div>
          </div>
          <div className="overlay-segments">
            {overlays.map((overlay) => {
              const position = calculateOverlayPosition(overlay)
              const isSelected = selectedOverlay === overlay.id
              
              return (
                <div
                  key={overlay.id}
                  className={`overlay-segment ${isSelected ? 'overlay-segment-selected' : ''}`}
                  style={{
                    ...position,
                    backgroundColor: getOverlayColor(overlay.type),
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectOverlay(overlay.id)
                  }}
                >
                  <div className="overlay-segment-content">
                    <div className="overlay-segment-icon">
                      {overlay.type === 'text' && 'T'}
                      {overlay.type === 'image' && 'I'}
                      {overlay.type === 'video' && 'V'}
                    </div>
                    <span className="overlay-segment-label">
                      {overlay.type === 'text' 
                        ? overlay.content.substring(0, 10) + (overlay.content.length > 10 ? '...' : '')
                        : overlay.type
                      }
                    </span>
                  </div>
                
                  <div className="overlay-segment-handle left-handle" />
                  <div className="overlay-segment-handle right-handle" />
                </div>
              )
            })}
          </div>
          <div 
            className="progress-bar"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>


        <div className="timeline-playback-controls">
          <div className="time-display-controls">
            <span className="current-time-display">
              {formatTime(currentTime)}
            </span>
            <span className="time-separator">/</span>
            <span className="total-time-display">
              {formatTime(duration)}
            </span>
          </div>
          
          <div className="playback-buttons">
            <button
              onClick={() => onSeek(Math.max(0, currentTime - 5))}
              className="playback-button skip-back-button"
              aria-label="Skip back 5 seconds"
            >
              <span className="skip-back-icon">-5s</span>
            </button>
            
            <button
              onClick={() => onSeek(Math.max(0, currentTime - 0.1))}
              className="playback-button frame-back-button"
              aria-label="Previous frame"
            >
              <span className="frame-back-icon">‹</span>
            </button>
            
            <button
              onClick={() => onSeek(Math.max(0, currentTime + 0.1))}
              className="playback-button frame-forward-button"
              aria-label="Next frame"
            >
              <span className="frame-forward-icon">›</span>
            </button>
            
            <button
              onClick={() => onSeek(Math.min(duration, currentTime + 5))}
              className="playback-button skip-forward-button"
              aria-label="Skip forward 5 seconds"
            >
              <span className="skip-forward-icon">+5s</span>
            </button>
          </div>
        </div>
      </div>
      {overlays.length > 0 && (
        <div className="overlay-legend">
          <h4 className="legend-title">Overlay Types</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color text-overlay-color" />
              <span className="legend-label">Text</span>
            </div>
            <div className="legend-item">
              <div className="legend-color image-overlay-color" />
              <span className="legend-label">Image</span>
            </div>
            <div className="legend-item">
              <div className="legend-color video-overlay-color" />
              <span className="legend-label">Video</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Timeline