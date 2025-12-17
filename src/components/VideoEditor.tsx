'use client'

import { useState, useRef } from 'react'
import * as ReactDnd from 'react-dnd'
const DndProvider = (ReactDnd as any).DndProvider
import { HTML5Backend } from 'react-dnd-html5-backend'
import VideoPreview from './VideoPreview'
import OverlayList from './OverlayList'
import Timeline from './Timeline'
import UploadSection from './UploadSection'
import ProcessingStatus from './ProcessingStatus'
import { Overlay, VideoFile } from '@/types'
import '@/styles/components/VideoEditor.css'

const VideoEditor = () => {
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null)
  const [overlays, setOverlays] = useState<Overlay[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedOverlay, setSelectedOverlay] = useState<string | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)

  const handleVideoLoad = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const addOverlay = (type: 'text' | 'image' | 'video') => {
    const newOverlay: Overlay = {
      id: `overlay-${Date.now()}`,
      type,
      content: type === 'text' ? 'New Text' : '',
      x: 50,
      y: 50,
      width: type === 'text' ? 200 : 100,
      height: type === 'text' ? 50 : 100,
      startTime: currentTime,
      endTime: Math.min(currentTime + 5, duration),
      fontSize: type === 'text' ? 24 : undefined,
      fontColor: type === 'text' ? '#FFFFFF' : undefined,
    }
    setOverlays([...overlays, newOverlay])
    setSelectedOverlay(newOverlay.id)
  }

  const updateOverlay = (id: string, updates: Partial<Overlay>) => {
    setOverlays(overlays.map(overlay => 
      overlay.id === id ? { ...overlay, ...updates } : overlay
    ))
  }

  const removeOverlay = (id: string) => {
    setOverlays(overlays.filter(overlay => overlay.id !== id))
    if (selectedOverlay === id) {
      setSelectedOverlay(null)
    }
  }

  const handleUploadComplete = (file: VideoFile) => {
    setVideoFile(file)
    setOverlays([])
    setSelectedOverlay(null)
    setCurrentTime(0)
    setIsPlaying(false)
  }

  // Use deployed backend by default, but keep empty on localhost so dev proxy (/api/*) continues to work
  const DEFAULT_BACKEND_URL = 'https://video-editor-app-backend.onrender.com'
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? (isLocalhost ? '' : DEFAULT_BACKEND_URL)
  const checkBackend = async (timeout = 3000) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    const healthUrl = API_BASE ? `${API_BASE}/api/health` : '/api/health'
    try {
      const res = await fetch(healthUrl, { signal: controller.signal })
      clearTimeout(id)
      return res.ok
    } catch (err) {
      clearTimeout(id)
      console.warn('Backend health check failed:', err)
      return false
    }
  }

  const handleSubmit = async () => {
    if (!videoFile) {
      alert('Please upload a video first')
      return
    }

    setIsProcessing(true)
    const backendOk = await checkBackend()
    if (!backendOk) {
      setIsProcessing(false)
      alert('Cannot reach backend. Make sure the backend server is running and that CORS or proxy is configured properly.')
      return
    }

    const formData = new FormData()
    formData.append('video', videoFile.file)
    formData.append('overlays', JSON.stringify(overlays))
    const uploadUrl = API_BASE ? `${API_BASE}/api/upload` : '/api/upload'

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        let text = ''
        try { text = await response.text() } catch (e) { /* ignore */ }
        console.error('Upload failed', response.status, text)
        alert(`Failed to upload: ${response.status} ${text || ''}`)
        return
      }

      const data = await response.json()
      if (data.success) {
        setJobId(data.jobId)
      } else {
        alert('Failed to process video: ' + (data.error || 'Unknown error'))
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('Request timed out', error)
        alert('Request timed out — the backend may be slow or unreachable')
      } else {
        console.error('Error posting upload:', error)
        alert('Failed to submit video for processing — this is often a network or CORS issue. Check that the backend is running and that you restarted Next after changing proxy settings.')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="video-editor-grid">
        {/* Left Sidebar - Upload & Overlay Controls */}
        <div className="video-editor-sidebar">
          <UploadSection 
            onUploadComplete={handleUploadComplete}
            videoFile={videoFile}
          />
          
          <OverlayList
            overlays={overlays}
            selectedOverlay={selectedOverlay}
            onSelectOverlay={setSelectedOverlay}
            onAddOverlay={addOverlay}
            onRemoveOverlay={removeOverlay}
            onUpdateOverlay={updateOverlay}
            currentTime={currentTime}
            duration={duration}
          />
        </div>
        <div className="video-editor-main">
          <div className="video-preview-card editor-card">
            <h2 className="video-preview-title">
              Video Preview
            </h2>
            
            <VideoPreview
              videoRef={videoRef}
              videoFile={videoFile}
              overlays={overlays}
              selectedOverlay={selectedOverlay}
              onVideoLoad={handleVideoLoad}
              onTimeUpdate={handleTimeUpdate}
              onSelectOverlay={setSelectedOverlay}
              onUpdateOverlay={updateOverlay}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
            />
          </div>
          <div className="timeline-card editor-card">
            <Timeline
              duration={duration}
              currentTime={currentTime}
              overlays={overlays}
              onSeek={handleSeek}
              selectedOverlay={selectedOverlay}
              onSelectOverlay={setSelectedOverlay}
            />
          </div>
          <div className="render-card editor-card">
            <div className="render-card-content">
              <div>
                <h3 className="render-title">
                  Render Video
                </h3>
                <p className="render-description">
                  Process video with all overlays applied
                </p>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={!videoFile || isProcessing}
                className={`render-button ${!videoFile || isProcessing ? 'render-button-disabled' : 'render-button-active'}`}
              >
                {isProcessing ? 'Processing...' : 'Render Video'}
              </button>
            </div>
          </div>
          {jobId && (
            <ProcessingStatus jobId={jobId} />
          )}
        </div>
      </div>
    </DndProvider>
  )
}

export default VideoEditor