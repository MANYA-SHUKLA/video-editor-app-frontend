'use client'

import { useState, useRef } from 'react'
import { VideoFile } from '@/types'
import { Upload, Video, FileVideo, X, CheckCircle, AlertCircle } from 'lucide-react'
import '@/styles/components/UploadSection.css'

interface UploadSectionProps {
  onUploadComplete: (file: VideoFile) => void
  videoFile: VideoFile | null
}

const UploadSection = ({ onUploadComplete, videoFile }: UploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file')
      return
    }

    if (file.size > 500 * 1024 * 1024) { // 500MB limit
      setError('File size must be less than 500MB')
      return
    }

    setError(null)
    setUploadProgress(0)
    const simulateUpload = () => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 10
        if (progress >= 100) {
          clearInterval(interval)
          progress = 100
          const videoFileObj: VideoFile = {
            file,
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size
          }
          onUploadComplete(videoFileObj)
        }
        setUploadProgress(progress)
      }, 100)
    }

    simulateUpload()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemoveFile = () => {
    if (videoFile?.url) {
      URL.revokeObjectURL(videoFile.url)
    }
    onUploadComplete(null as any) // Reset
    setUploadProgress(0)
    setError(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const supportedFormats = ['MP4', 'MOV', 'AVI', 'WMV', 'FLV', 'MKV', 'WebM']

  return (
    <div className="upload-section-container">
      <div className="upload-section-header">
        <div className="upload-header-content">
          <Video className="upload-header-icon" />
          <div>
            <h3 className="upload-header-title">Upload Video</h3>
            <p className="upload-header-subtitle">Start editing by uploading your video</p>
          </div>
        </div>
      </div>

      <div className="upload-section-content">
        {!videoFile ? (
          <>
            <div
              className={`upload-dropzone ${isDragging ? 'upload-dropzone-active' : ''} ${error ? 'upload-dropzone-error' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="dropzone-content">
                <div className="dropzone-icon-wrapper">
                  <Upload className="dropzone-icon" />
                </div>
                <div className="dropzone-text">
                  <h4 className="dropzone-title">
                    {isDragging ? 'Drop video here' : 'Drag & drop your video'}
                  </h4>
                  <p className="dropzone-subtitle">
                    or click to browse files
                  </p>
                </div>
                <button className="browse-button">
                  Browse Files
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileInputChange}
                className="file-input-hidden"
              />
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="upload-progress-container">
                <div className="upload-progress-header">
                  <span className="upload-progress-title">Uploading...</span>
                  <span className="upload-progress-percent">{uploadProgress.toFixed(0)}%</span>
                </div>
                <div className="upload-progress-bar">
                  <div 
                    className="upload-progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
            {error && (
              <div className="upload-error-container">
                <AlertCircle className="error-icon" />
                <span className="error-message">{error}</span>
              </div>
            )}
            <div className="supported-formats-container">
              <h5 className="formats-title">Supported Formats</h5>
              <div className="formats-grid">
                {supportedFormats.map((format, index) => (
                  <div key={index} className="format-badge">
                    {format}
                  </div>
                ))}
              </div>
            </div>
            <div className="upload-tips-container">
              <h5 className="tips-title">
                <FileVideo className="tips-title-icon" />
                Upload Tips
              </h5>
              <ul className="tips-list">
                <li className="tip-item">Maximum file size: 500MB</li>
                <li className="tip-item">Use MP4 format for best compatibility</li>
                <li className="tip-item">Keep videos under 10 minutes for faster processing</li>
                <li className="tip-item">Landscape videos work best for editing</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="uploaded-file-container">
            <div className="uploaded-file-header">
              <div className="file-header-content">
                <CheckCircle className="success-icon" />
                <div>
                  <h4 className="file-title">Video Uploaded Successfully!</h4>
                  <p className="file-subtitle">Ready for editing</p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="remove-file-button"
                aria-label="Remove file"
              >
                <X className="remove-icon" />
              </button>
            </div>

            <div className="file-details-container">
              <div className="file-preview-wrapper">
                <video
                  src={videoFile.url}
                  className="file-preview-video"
                  controls={false}
                  muted
                  preload="metadata"
                />
                <div className="file-preview-overlay">
                  <Video className="preview-overlay-icon" />
                </div>
              </div>

              <div className="file-info-grid">
                <div className="file-info-item">
                  <span className="info-label">File Name</span>
                  <span className="info-value file-name">{videoFile.name}</span>
                </div>
                <div className="file-info-item">
                  <span className="info-label">File Size</span>
                  <span className="info-value">{formatFileSize(videoFile.size)}</span>
                </div>
                <div className="file-info-item">
                  <span className="info-label">Status</span>
                  <span className="info-value status-ready">Ready to Edit</span>
                </div>
                <div className="file-info-item">
                  <span className="info-label">Type</span>
                  <span className="info-value file-type">Video</span>
                </div>
              </div>
            </div>

            <div className="file-actions-container">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="action-button replace-button"
              >
                Replace Video
              </button>
              <button
                onClick={() => {
                  document.querySelector('.overlay-list-container')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  })
                }}
                className="action-button start-editing-button"
              >
                Start Editing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadSection