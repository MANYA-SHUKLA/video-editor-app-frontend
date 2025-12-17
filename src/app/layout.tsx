import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Video Editor Pro - Edit Videos Online',
  description: 'Professional video editing tool with overlays, text, images, and real-time preview',
  keywords: 'video editor, edit video, overlay, text on video, video processing',
  authors: [{ name: 'Video Editor Team' }],
  openGraph: {
    type: 'website',
    title: 'Video Editor Pro',
    description: 'Edit videos online with advanced overlay features',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          {children}
        </div>
      </body>
    </html>
  )
}