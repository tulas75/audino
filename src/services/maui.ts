export interface MAUITranscriptionResponse {
  transcription: string;
  confidence: number;
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

export interface MAUIFormCompilationResponse {
  success: boolean;
  compiledForm: any;
  suggestions?: any;
  errors?: string[];
}

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
    formData.append('audio', audioBlob, 'recording.webm');

    const response = await fetch(`${this.baseUrl}/transcribe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-API-Key': this.apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    return response.json();
  }

  async compileAudioForm(
    request: MAUIFormCompilationRequest,
    token: string
  ): Promise<MAUIFormCompilationResponse> {
    const response = await fetch(`${this.baseUrl}/audioformcompilation`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Form compilation failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Mock methods for development
  async mockTranscribeAudio(audioBlob: Blob): Promise<MAUITranscriptionResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock transcription based on audio duration
    const mockTranscriptions = [
      "This is a test recording for the audio PWA application. We are discussing the project requirements and implementation details.",
      "Meeting notes: We need to integrate the MAUI service for audio transcription and form compilation. The deadline is next week.",
      "Interview transcript: The candidate has strong technical skills and good communication abilities. Recommended for the position.",
      "Lecture content: Today we will cover the basics of web audio APIs and how to implement recording functionality in modern browsers.",
      "Music session: This is a recording of our band practice. We worked on three new songs and improved our harmonies."
    ];

    const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];

    return {
      transcription: randomTranscription,
      confidence: 0.95,
      duration: Math.floor(audioBlob.size / 1000), // Rough estimate
      language: 'en'
    };
  }

  async mockCompileAudioForm(request: MAUIFormCompilationRequest): Promise<MAUIFormCompilationResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock form compilation response
    const compiledForm = {
      title: this.extractTitleFromTranscription(request.transcribedAudio),
      description: request.transcribedAudio.substring(0, 100) + "...",
      category: this.suggestCategory(request.transcribedAudio),
      tags: this.extractTags(request.transcribedAudio),
      isPublic: false,
      transcriptionEnabled: true,
      confidence: 0.87,
      processingTime: "2.3s"
    };

    return {
      success: true,
      compiledForm,
      suggestions: {
        alternativeTitles: [
          "Alternative title suggestion 1",
          "Alternative title suggestion 2"
        ],
        recommendedTags: ["ai-generated", "transcribed", "processed"]
      }
    };
  }

  private extractTitleFromTranscription(transcription: string): string {
    const words = transcription.split(' ').slice(0, 6);
    return words.join(' ') + (transcription.split(' ').length > 6 ? '...' : '');
  }

  private suggestCategory(transcription: string): string {
    const text = transcription.toLowerCase();
    if (text.includes('meeting') || text.includes('discussion')) return 'meeting';
    if (text.includes('interview') || text.includes('candidate')) return 'interview';
    if (text.includes('lecture') || text.includes('lesson')) return 'lecture';
    if (text.includes('music') || text.includes('song')) return 'music';
    return 'other';
  }

  private extractTags(transcription: string): string[] {
    const text = transcription.toLowerCase();
    const tags: string[] = [];
    
    if (text.includes('important')) tags.push('important');
    if (text.includes('urgent')) tags.push('urgent');
    if (text.includes('project')) tags.push('project');
    if (text.includes('meeting')) tags.push('meeting');
    if (text.includes('decision')) tags.push('decision');
    
    return tags.length > 0 ? tags : ['general'];
  }
}
