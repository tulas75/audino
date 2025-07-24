export interface AudioRecording {
  id: string;
  name: string;
  blob: Blob;
  duration: number;
  createdAt: Date;
  uploaded: boolean;
  transcription?: string;
  compiledForm?: any;
}

export interface RecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  mediaRecorder: MediaRecorder | null;
}
