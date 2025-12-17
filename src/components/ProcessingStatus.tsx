'use client'

import { useState, useEffect } from 'react'
import { JobStatus } from '@/types'
import { Loader, CheckCircle, XCircle, Download, Clock, RefreshCw } from 'lucide-react'
import '@/styles/components/ProcessingStatus.css'

interface ProcessingStatusProps {
  jobId: string
}

const ProcessingStatus = ({ jobId }: ProcessingStatusProps) => {
  const [status, setStatus] = useState<JobStatus | null>(null)
  const [isPolling, setIsPolling] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Use deployed backend by default, but keep empty on localhost so dev proxy (/api/*) continues to work
  const DEFAULT_BACKEND_URL = 'https://video-editor-app-backend.onrender.com'
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? (isLocalhost ? '' : DEFAULT_BACKEND_URL)

  const fetchStatus = async () => {
    try {
      const statusUrl = API_BASE ? `${API_BASE}/api/status/${jobId}` : `/api/status/${jobId}`
      const response = await fetch(statusUrl)
      if (!response.ok) {
        throw new Error('Failed to fetch status')
      }
      const data = await response.json()
      setStatus(data)
      setError(null)
      
   
      if (data.status === 'completed' || data.status === 'failed') {
        setIsPolling(false)
      }
    } catch (err) {
      setError('Unable to fetch job status')
      console.error('Error fetching status:', err)
    }
  }

  useEffect(() => {
    fetchStatus()
    
    if (isPolling) {
      const interval = setInterval(fetchStatus, 2000) // Poll every 2 seconds
      return () => clearInterval(interval)
    }
  }, [jobId, isPolling])

  const handleDownload = async () => {
    if (!status?.outputVideo) return
    
    try {
      const resultUrl = API_BASE ? `${API_BASE}/api/result/${jobId}` : `/api/result/${jobId}`
      const response = await fetch(resultUrl)
      if (!response.ok) {
        throw new Error('Failed to download video')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `edited_video_${jobId}.mp4`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError('Failed to download video')
      console.error('Download error:', err)
    }
  }

  const handleRetryPolling = () => {
    setIsPolling(true)
    fetchStatus()
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getStatusIcon = () => {
    if (!status) return <Loader className="status-icon" />
    
    switch (status.status) {
      case 'pending':
        return <Clock className="status-icon status-icon-pending" />
      case 'processing':
        return <Loader className="status-icon status-icon-processing" />
      case 'completed':
        return <CheckCircle className="status-icon status-icon-completed" />
      case 'failed':
        return <XCircle className="status-icon status-icon-failed" />
      default:
        return <Loader className="status-icon" />
    }
  }

  const getStatusColor = () => {
    if (!status) return '#6b7280'
    
    switch (status.status) {
      case 'pending': return '#f59e0b'
      case 'processing': return '#3b82f6'
      case 'completed': return '#10b981'
      case 'failed': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusMessage = () => {
    if (!status) return 'Checking status...'
    
    switch (status.status) {
      case 'pending':
        return 'Waiting to start processing'
      case 'processing':
        return `Processing video... ${status.progress}%`
      case 'completed':
        return 'Video processing completed successfully!'
      case 'failed':
        return status.error || 'Video processing failed'
      default:
        return 'Unknown status'
    }
  }

  if (!status && !error) {
    return (
      <div className="processing-status-container">
        <div className="status-loading">
          <Loader className="loading-spinner" />
          <span>Loading status...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="processing-status-container">
      <div className="status-header">
        <div className="status-header-content">
          <div className="status-icon-wrapper">
            {getStatusIcon()}
          </div>
          <div>
            <h3 className="status-title">Video Processing</h3>
            <p className="status-subtitle">Job ID: {jobId.substring(0, 8)}...</p>
          </div>
        </div>
        
        {status?.status === 'processing' && (
          <button
            onClick={() => setIsPolling(!isPolling)}
            className="polling-toggle-button"
            aria-label={isPolling ? 'Pause updates' : 'Resume updates'}
          >
            <RefreshCw className={`polling-icon ${isPolling ? 'polling-active' : ''}`} />
            <span className="polling-label">
              {isPolling ? 'Live' : 'Paused'}
            </span>
          </button>
        )}
      </div>

      <div className="status-content">
        <div className="status-progress-section">
          <div className="progress-header">
            <span className="progress-title">Processing Progress</span>
            <span className="progress-percent">{status?.progress || 0}%</span>
          </div>
          
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ 
                width: `${status?.progress || 0}%`,
                backgroundColor: getStatusColor()
              }}
            />
            <div className="progress-bar-track" />
            <div className="progress-milestones">
              <div className="milestone milestone-uploaded">
                <div className="milestone-dot" />
                <span className="milestone-label">Uploaded</span>
              </div>
              <div className="milestone milestone-processing">
                <div className="milestone-dot" />
                <span className="milestone-label">Processing</span>
              </div>
              <div className="milestone milestone-rendering">
                <div className="milestone-dot" />
                <span className="milestone-label">Rendering</span>
              </div>
              <div className="milestone milestone-completed">
                <div className="milestone-dot" />
                <span className="milestone-label">Completed</span>
              </div>
            </div>
          </div>
        </div>
        <div 
          className="status-message-container"
          style={{ borderColor: getStatusColor() }}
        >
          <div className="status-message-content">
            <div className="status-message-icon">
              {getStatusIcon()}
            </div>
            <div className="status-message-text">
              <p className="status-message">{getStatusMessage()}</p>
              {status?.status === 'processing' && (
                <p className="status-hint">
                  This may take a few minutes depending on video length and complexity.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="job-details-container">
          <h4 className="details-title">Job Details</h4>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span 
                className="detail-value status-badge"
                style={{ backgroundColor: getStatusColor() }}
              >
                {status?.status?.toUpperCase()}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Started</span>
              <span className="detail-value">
                {status?.createdAt ? formatTime(status.createdAt) : 'N/A'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Last Update</span>
              <span className="detail-value">
                {status?.updatedAt ? formatTime(status.updatedAt) : 'N/A'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Progress</span>
              <span className="detail-value progress-text">
                {status?.progress || 0}%
              </span>
            </div>
          </div>
        </div>
        {error && (
          <div className="error-display-container">
            <XCircle className="error-display-icon" />
            <div className="error-display-content">
              <p className="error-display-title">Connection Error</p>
              <p className="error-display-message">{error}</p>
              <button
                onClick={handleRetryPolling}
                className="retry-button"
              >
                <RefreshCw className="retry-icon" />
                Retry Connection
              </button>
            </div>
          </div>
        )}
        <div className="action-buttons-container">
          {status?.status === 'completed' ? (
            <button
              onClick={handleDownload}
              className="action-button download-button"
            >
              <Download className="button-icon" />
              Download Video
            </button>
          ) : status?.status === 'failed' ? (
            <div className="failed-actions">
              <button
                onClick={handleRetryPolling}
                className="action-button retry-action-button"
              >
                <RefreshCw className="button-icon" />
                Check Status Again
              </button>
              <a
                href="/"
                className="action-button new-video-button"
              >
                Upload New Video
              </a>
            </div>
          ) : (
            <div className="processing-actions">
              <button
                onClick={() => setIsPolling(!isPolling)}
                className="action-button toggle-polling-button"
              >
                <RefreshCw className={`button-icon ${isPolling ? 'spinning' : ''}`} />
                {isPolling ? 'Pause Updates' : 'Resume Updates'}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="action-button refresh-page-button"
              >
                Refresh Page
              </button>
            </div>
          )}
        </div>
        {status?.status === 'processing' && (
          <div className="processing-tips-container">
            <h5 className="tips-title">
              <Clock className="tips-title-icon" />
              Processing Tips
            </h5>
            <ul className="tips-list">
              <li className="tip-item">Do not close this tab while processing</li>
              <li className="tip-item">Larger videos take longer to process</li>
              <li className="tip-item">You can continue editing other videos</li>
              <li className="tip-item">Processing continues even if you navigate away</li>
            </ul>
          </div>
        )}
      </div>
      {status?.status === 'processing' && (
        <div className="estimated-time-container">
          <div className="estimated-time-content">
            <Clock className="time-icon" />
            <div className="time-estimate">
              <span className="time-label">Estimated completion:</span>
              <span className="time-value">2-5 minutes</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProcessingStatus