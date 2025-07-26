export interface MAUITranscriptionResponse {
  text: string;
  duration: number;
  language?: string;
}

export interface MAUIFormCompilationRequest {
  formSchema: any;
  formSchemaName: string;
  formSchemaExampleData: any;
  formSchemaChoices: any;
  transcribedAudio: string;
}

export type MAUIFormCompilationResponse = any[];

export class MAUIService {
  private static instance: MAUIService;
  private baseUrl: string;
  private apiKey: string;

  private constructor() {
    this.baseUrl = import.meta.env.VITE_MAUI_API_URL || 'https://api.maui.com';
    this.apiKey = import.meta.env.VITE_MAUI_API_KEY || '';
  }

  static getInstance(): MAUIService {
    if (!MAUIService.instance) {
      MAUIService.instance = new MAUIService();
    }
    return MAUIService.instance;
  }

  private getAuthHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  async transcribeAudio(audioBlob: Blob, token: string): Promise<MAUITranscriptionResponse> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('lang', 'ITA');

    // Get API key and user email from localStorage
    const apiKey = localStorage.getItem('pandas_dino_api_key') || '';
    const userEmail = localStorage.getItem('auth_user_email') || '';

    const response = await fetch(`${this.baseUrl}/transcribe`, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'X-USER-EMAIL': userEmail,
        'X-USER-NAME': 'admin gnucoop'
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    return response.json();
  }

  async compileAudioForm(
    request: any
  ): Promise<MAUIFormCompilationResponse> {
    // Get API key and user email from localStorage
    const apiKey = localStorage.getItem('pandas_dino_api_key') || '';
    const userEmail = localStorage.getItem('auth_user_email') || '';

    const response = await fetch(`${this.baseUrl}/audioformcompilation`, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'X-USER-EMAIL': userEmail,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Form compilation failed: ${response.statusText}`);
    }

    return response.json();
  }

}
