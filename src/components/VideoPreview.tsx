'use client'

import { useRef, useState } from 'react'
import * as ReactDnd from 'react-dnd'
import { Overlay, VideoFile } from '@/types'
import { Play, Pause, Upload, Expand, Shrink } from 'lucide-react'
import '@/styles/components/VideoPreview.css'

interface VideoPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  videoFile: VideoFile | null
  overlays: Overlay[]
  selectedOverlay: string | null
  onVideoLoad: () => void
  onTimeUpdate: () => void
  onSelectOverlay: (id: string) => void
  onUpdateOverlay: (id: string, updates: Partial<Overlay>) => void
  isPlaying: boolean
  onPlayPause: () => void
}

const OverlayItem = ({ 
  overlay, 
  isSelected, 
  onSelect, 
  onUpdate, 
  containerRef 
}: { 
  overlay: Overlay
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<Overlay>) => void
  containerRef: React.RefObject<HTMLDivElement | null>
}) => {
  const [{ isDragging }, drag] = (ReactDnd as any).useDrag({
    type: 'overlay',
    item: { id: overlay.id, type: overlay.type },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = (ReactDnd as any).useDrop({
    accept: 'overlay',
    drop: (item: { id: string }) => {
      if (item.id !== overlay.id) {
      }
    },
  })

  const handleResize = (direction: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right', e: React.MouseEvent) => {
    e.stopPropagation()
    const rect = (e.target as HTMLElement).parentElement?.getBoundingClientRect()
    if (!rect) return

    const scale = 0.01 // Sensitivity of resize
    const deltaX = e.movementX * scale
    const deltaY = e.movementY * scale

    const updates: Partial<Overlay> = {}
    
    if (direction.includes('left')) {
      updates.x = overlay.x + deltaX * 100
      updates.width = Math.max(50, overlay.width - deltaX * 100)
    }
    if (direction.includes('right')) {
      updates.width = Math.max(50, overlay.width + deltaX * 100)
    }
    if (direction.includes('top')) {
      updates.y = overlay.y + deltaY * 100
      updates.height = Math.max(30, overlay.height - deltaY * 100)
    }
    if (direction.includes('bottom')) {
      updates.height = Math.max(30, overlay.height + deltaY * 100)
    }

    onUpdate(updates)
  }
  const onMouseDownMove = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    const container = containerRef.current
    if (!container) return
    const containerRect = container.getBoundingClientRect()
    const target = e.currentTarget as HTMLDivElement
    const targetRect = target.getBoundingClientRect()
    const offsetX = e.clientX - targetRect.left
    const offsetY = e.clientY - targetRect.top

    const onMouseMove = (ev: MouseEvent) => {
      let newLeftPx = ev.clientX - containerRect.left - offsetX
      let newTopPx = ev.clientY - containerRect.top - offsetY
      const maxLeft = containerRect.width - targetRect.width
      const maxTop = containerRect.height - targetRect.height
      newLeftPx = Math.min(Math.max(0, newLeftPx), Math.max(0, maxLeft))
      newTopPx = Math.min(Math.max(0, newTopPx), Math.max(0, maxTop))
      const xPercent = (newLeftPx / containerRect.width) * 100
      const yPercent = (newTopPx / containerRect.height) * 100

      onUpdate({ x: xPercent, y: yPercent })
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`overlay-item ${isSelected ? 'overlay-item-selected' : ''}`}
      style={{
        left: `${overlay.x}%`,
        top: `${overlay.y}%`,
        width: `${overlay.width}px`,
        height: `${overlay.height}px`,
        opacity: isDragging ? 0.5 : 1,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onMouseDown={onMouseDownMove}
    >
      {overlay.type === 'text' && (
        <div 
          className="text-overlay-element"
          style={{
            fontSize: `${overlay.fontSize}px`,
            color: overlay.fontColor,
            backgroundColor: overlay.backgroundColor || 'rgba(0, 0, 0, 0.7)',
          }}
        >
          {overlay.content}
        </div>
      )}
      
      {overlay.type === 'image' && overlay.content && (
        <div className="image-overlay-element">
          <img 
            src={overlay.content} 
            alt="Overlay" 
            className="image-overlay-img"
          />
        </div>
      )}
      
      {isSelected && (
        <>
          <div className="overlay-resize-handle resize-handle-top-left" 
               onMouseDown={(e) => handleResize('top-left', e)} />
          <div className="overlay-resize-handle resize-handle-top-right" 
               onMouseDown={(e) => handleResize('top-right', e)} />
          <div className="overlay-resize-handle resize-handle-bottom-left" 
               onMouseDown={(e) => handleResize('bottom-left', e)} />
          <div className="overlay-resize-handle resize-handle-bottom-right" 
               onMouseDown={(e) => handleResize('bottom-right', e)} />
        </>
      )}
    </div>
  )
}

const VideoPreview = ({
  videoRef,
  videoFile,
  overlays,
  selectedOverlay,
  onVideoLoad,
  onTimeUpdate,
  onSelectOverlay,
  onUpdateOverlay,
  isPlaying,
  onPlayPause,
}: VideoPreviewProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = () => {
    const container = document.querySelector('.video-preview-wrapper')
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentTime = videoRef.current?.currentTime || 0
  const duration = videoRef.current?.duration || 0

  return (
    <div className="video-preview-wrapper">
      <div className="video-container" ref={containerRef}>
        {videoFile ? (
          <>
            <video
              ref={videoRef}
              className="video-element"
              src={videoFile.url}
              onLoadedMetadata={onVideoLoad}
              onTimeUpdate={onTimeUpdate}
              onClick={onPlayPause}
            />
            {overlays.map((overlay) => (
              <OverlayItem
                key={overlay.id}
                overlay={overlay}
                isSelected={selectedOverlay === overlay.id}
                onSelect={() => onSelectOverlay(overlay.id)}
                onUpdate={(updates) => onUpdateOverlay(overlay.id, updates)}
                containerRef={containerRef}
              />
            ))}
          </>
        ) : (
          <div className="video-empty-state">
            <Upload className="video-empty-state-icon" size={64} />
            <h3 className="video-empty-state-title">No Video Loaded</h3>
            <p className="video-empty-state-description">
              Upload a video to start editing. You can add text, images, and video overlays.
            </p>
          </div>
        )}
      </div>

      {videoFile && (
        <div className="video-controls-overlay">
          <div className="video-controls-container">
            <button
              onClick={onPlayPause}
              className="video-control-button play-pause-button"
            >
              {isPlaying ? (
                <Pause className="control-button-icon" />
              ) : (
                <Play className="control-button-icon" />
              )}
            </button>

            <div className="time-controls-section">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => {
                  const time = parseFloat(e.target.value)
                  videoRef.current!.currentTime = time
                }}
                className="time-slider-control"
              />
              <div className="time-display-container">
                <span className="current-time-display">{formatTime(currentTime)}</span>
                <span className="duration-display">{formatTime(duration)}</span>
              </div>
            </div>

            <button
              onClick={toggleFullscreen}
              className="video-control-button fullscreen-button"
            >
              {isFullscreen ? (
                <Shrink className="control-button-icon" />
              ) : (
                <Expand className="control-button-icon" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPreview