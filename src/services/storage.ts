import localforage from 'localforage';
import { AudioRecording } from '../types/audio';

class StorageService {
  private static instance: StorageService;
  private audioStore: LocalForage;

  private constructor() {
    this.audioStore = localforage.createInstance({
      name: 'AudioPWA',
      storeName: 'recordings',
    });
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async saveRecording(recording: AudioRecording): Promise<void> {
    await this.audioStore.setItem(recording.id, recording);
  }

  async getRecording(id: string): Promise<AudioRecording | null> {
    return await this.audioStore.getItem(id);
  }

  async getAllRecordings(): Promise<AudioRecording[]> {
    const recordings: AudioRecording[] = [];
    await this.audioStore.iterate((value: AudioRecording) => {
      recordings.push(value);
    });
    return recordings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async deleteRecording(id: string): Promise<void> {
    await this.audioStore.removeItem(id);
  }

  async updateRecording(recording: AudioRecording): Promise<void> {
    await this.audioStore.setItem(recording.id, recording);
  }
}

export default StorageService;
