'use client'
import VideoEditor from '@/components/VideoEditor'
import '@/styles/components/VideoEditor.css'
import { Github, Linkedin } from 'lucide-react'

export default function Home() {
  return (
    <div className="video-editor-container animate-fade-in">

      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
    
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">VE</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Video Editor
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                  Edit videos online with overlays
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="container-responsive py-6 md:py-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Edit Videos Like a <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Pro</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            Upload your video, add text, images, or video overlays, and render professionally edited videos in minutes.
          </p>
        </div>
        <VideoEditor />
        <div className="mt-16 md:mt-24">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Powerful Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="editor-card feature-card p-6 rounded-2xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl feature-icon flex items-center justify-center mb-4">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h4 className="text-xl feature-title font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-gray-600 feature-desc dark:text-gray-400 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-800">
        <div className="container-responsive py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center footer-logo">
                  <span className="text-white font-bold text-lg">VE</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Video Editor
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Professional video editing made simple
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                © {new Date().getFullYear()} Video Editor. All rights reserved.
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                Built with Next.js, Tailwind CSS, and FFmpeg
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                Made with <span role="img" aria-label="love" className="text-red-500">♥</span> by{' '}
                <a
                  href="https://github.com/MANYA-SHUKLA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  Manya Shukla
                </a>
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                <a
                  href="https://github.com/MANYA-SHUKLA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline inline-flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
                <span className="mx-2">·</span>
                <a
                  href="https://www.linkedin.com/in/manya-shukla99/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline inline-flex items-center gap-2"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: '🎬',
    title: 'Real-time Preview',
    description: 'See changes instantly as you edit with live preview'
  },
  {
    icon: '✨',
    title: 'Drag & Drop',
    description: 'Intuitive drag and drop interface for positioning overlays'
  },
  {
    icon: '⏱️',
    title: 'Timeline Control',
    description: 'Precise timing control for when overlays appear and disappear'
  },
  {
    icon: '⚡',
    title: 'Fast Processing',
    description: 'Quick video rendering with progress tracking'
  }
]