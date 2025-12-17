export interface Overlay {
  id: string;
  type: 'text' | 'image' | 'video';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  startTime: number;
  endTime: number;
  fontSize?: number;
  fontColor?: string;
  backgroundColor?: string;
}

export interface VideoFile {
  file: File;
  url: string;
  name: string;
  size: number;
}

export interface JobStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  outputVideo?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}