# Frontend — Video Editor App

Next.js frontend for the Video Editor App (TypeScript + Tailwind CSS).

Made by Manya Shukla

## Quick overview

This is the UI application that lets users upload videos, add overlays and timeline edits, and send jobs to the backend for processing. The app uses Next.js (App Router), React, TypeScript and Tailwind CSS.

## Features

- Upload videos and manage video jobs
- Preview videos and overlays
- Drag-and-drop timeline editing
- Communicates with backend API (proxied via `next.config.ts`)

## Folder structure

- `public/` — static assets (images, icons)
- `src/`
  - `app/` — Next.js app files (root layout, global styles, pages)
  - `components/` — React components (UploadSection, VideoEditor, Timeline, etc.)
  - `styles/` — component-specific and global CSS
  - `types/` — shared TypeScript types
- `next.config.ts` — Next.js configuration (API proxy rewrites)
- `package.json` — scripts and dependencies
- `tailwind.config.js`, `postcss.config.mjs`, `tsconfig.json` — tooling configs

## Requirements

- Node.js (16+ recommended, use the version compatible with your environment)
- npm or yarn
- Backend server running (defaults to `http://localhost:5001`)

## Setup & development

1. Change to the frontend folder:

   cd frontend

2. Install dependencies:

   npm install

3. Start the dev server:

   npm run dev

4. Open the app in your browser at `http://localhost:3000`

## Environment variables

- `BACKEND_URL` — Optional. If set, `next.config.ts` will rewrite `/api/*` to `${BACKEND_URL}/api/*`. Defaults to `http://localhost:5001` when not provided.

If you change `BACKEND_URL`, restart the dev server so rewrites take effect.

## Build & production

- Build: `npm run build`
- Start (production): `npm start`

## How to use

- Upload a video using the Upload section
- Add overlays, arrange them on the timeline and submit the job
- The backend processes the job and returns the output video
- Check the ProcessingStatus component to track progress

## Contributing

- Open issues or PRs
- Keep changes small and focused
- Run linting via `npm run lint` before submitting a PR

## Author

Manya Shukla
