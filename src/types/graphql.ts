export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServerRecording {
  id: string;
  name: string;
  duration: number;
  createdAt: string;
  uploadedAt?: string;
  fileUrl?: string;
  status: 'UPLOADING' | 'COMPLETED' | 'FAILED';
}

export interface AudioUploadInput {
  name: string;
  duration: number;
  audioFile: File;
}

export interface UploadResponse {
  id: string;
  name: string;
  duration: number;
  fileUrl: string;
  status: string;
  uploadedAt: string;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}
