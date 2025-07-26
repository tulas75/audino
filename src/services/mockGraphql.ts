import { UserProfile, ServerRecording } from '../types/graphql';

// Mock form schema data
export const MOCK_FORM_SCHEMA = [ {

    "id": 1,
    "name": "new_slide_1",
    "label": "New Slide 1",
    "nodes": [
      {
        "id": 1001,
        "hint": null,
        "name": "case_name",
        "size": "normal",
        "label": "nome paziente",
        "parent": 1,
        "warning": {
          "conditions": []
        },
        "editable": false,
        "nodeType": 0,
        "fieldType": 1,
        "parentNode": 0,
        "validation": {
          "conditions": []
        },
        "visibility": {
          "condition": "true"
        },
        "description": null,
        "defaultValue": null,
        "conditionalBranches": [
          {
            "condition": "true"
          }
        ]
      },
      {
        "id": 1002,
        "hint": null,
        "name": "new_field_2",
        "size": "normal",
        "label": "età",
        "parent": 1001,
        "warning": {
          "conditions": []
        },
        "editable": true,
        "nodeType": 0,
        "fieldType": 2,
        "parentNode": 0,
        "validation": {
          "conditions": []
        },
        "visibility": {
          "condition": "true"
        },
        "description": null,
        "defaultValue": null,
        "conditionalBranches": [
          {
            "condition": "true"
          }
        ]
      },
      {
        "id": 1003,
        "hint": null,
        "name": "new_field_4",
        "size": "normal",
        "label": "migrante",
        "parent": 1002,
        "warning": {
          "conditions": []
        },
        "editable": true,
        "nodeType": 0,
        "fieldType": 3,
        "parentNode": 0,
        "validation": {
          "conditions": []
        },
        "visibility": {
          "condition": "true"
        },
        "description": null,
        "defaultValue": null,
        "conditionalBranches": [
          {
            "condition": "true"
          }
        ]
      },
      {
        "id": 1004,
        "hint": null,
        "name": "new_field_3",
        "size": "normal",
        "label": "problemi",
        "parent": 1003,
        "warning": {
          "conditions": []
        },
        "editable": true,
        "nodeType": 0,
        "fieldType": 5,
        "parentNode": 0,
        "validation": {
          "conditions": []
        },
        "visibility": {
          "condition": "true"
        },
        "description": null,
        "forceNarrow": false,
        "defaultValue": null,
        "forceExpanded": false,
        "choicesOriginRef": "probl",
        "triggerConditions": [],
        "conditionalBranches": [
          {
            "condition": "true"
          }
        ]
      },
      {
        "id": 1005,
        "hint": null,
        "name": "new_field_1",
        "size": "normal",
        "label": "Commenti",
        "parent": 1004,
        "warning": {
          "conditions": []
        },
        "editable": true,
        "nodeType": 0,
        "fieldType": 1,
        "parentNode": 0,
        "validation": {
          "conditions": []
        },
        "visibility": {
          "condition": "true"
        },
        "description": null,
        "defaultValue": null,
        "conditionalBranches": [
          {
            "condition": "true"
          }
        ]
      }
    ],
    "parent": 0,
    "nodeType": 3,
    "readonly": {
      "condition": "false"
    },
    "parentNode": 0,
    "visibility": {
      "condition": "true"
    },
    "conditionalBranches": [
      {
        "condition": "true"
      }
    ]
}
];

export const MOCK_FORM_SCHEMA_NAME = "audio";

export const MOCK_FORM_SCHEMA_EXAMPLE_DATA = [ {
    "id": 1,
    "name": "new_slide_1",
    "label": "New Slide 1",
    "nodes": [
      {
        "id": 1001,
        "hint": null,
        "name": "case_name",
        "size": "normal",
        "label": "nome paziente",
        "parent": 1,
        "warning": {
          "conditions": []
        },
        "editable": false,
        "nodeType": 0,
        "fieldType": 1,
        "parentNode": 0,
        "validation": {
          "conditions": []
        },
        "visibility": {
          "condition": "true"
        },
        "description": null,
        "defaultValue": null,
        "conditionalBranches": [
          {
            "condition": "true"
          }
        ]
      },
      {
        "id": 1002,
        "hint": null,
        "name": "new_field_2",
        "size": "normal",
        "label": "età",
        "parent": 1001,
        "warning": {
          "conditions": []
        },
        "editable": true,
        "nodeType": 0,
        "fieldType": 2,
        "parentNode": 0,
        "validation": {
          "conditions": []
        },
        "visibility": {
          "condition": "true"
        },
        "description": null,
        "defaultValue": null,
        "conditionalBranches": [
          {
            "condition": "true"
          }
        ]
      },
      {
        "id": 1003,
        "hint": null,
        "name": "new_field_4",
        "size": "normal",
        "label": "migrante",
        "parent": 1002,
        "warning": {
          "conditions": []
        },
        "editable": true,
        "nodeType": 0,
        "fieldType": 3,
        "parentNode": 0,
        "validation": {
          "conditions": []
        },
        "visibility": {
          "condition": "true"
        },
        "description": null,
        "defaultValue": null,
        "conditionalBranches": [
          {
            "condition": "true"
          }
        ]
      },
      {
        "id": 1004,
        "hint": null,
        "name": "new_field_3",
        "size": "normal",
        "label": "problemi",
        "parent": 1003,
        "warning": {
          "conditions": []
        },
        "editable": true,
        "nodeType": 0,
        "fieldType": 5,
        "parentNode": 0,
        "validation": {
          "conditions": []
        },
        "visibility": {
          "condition": "true"
        },
        "description": null,
        "forceNarrow": false,
        "defaultValue": null,
        "forceExpanded": false,
        "choicesOriginRef": "probl",
        "triggerConditions": [],
        "conditionalBranches": [
          {
            "condition": "true"
          }
        ]
      },
      {
        "id": 1005,
        "hint": null,
        "name": "new_field_1",
        "size": "normal",
        "label": "Commenti",
        "parent": 1004,
        "warning": {
          "conditions": []
        },
        "editable": true,
        "nodeType": 0,
        "fieldType": 1,
        "parentNode": 0,
        "validation": {
          "conditions": []
        },
        "visibility": {
          "condition": "true"
        },
        "description": null,
        "defaultValue": null,
        "conditionalBranches": [
          {
            "condition": "true"
          }
        ]
      }
    ],
    "parent": 0,
    "nodeType": 3,
    "readonly": {
      "condition": "false"
    },
    "parentNode": 0,
    "visibility": {
      "condition": "true"
    },
    "conditionalBranches": [
      {
        "condition": "true"
      }
    ]
}
];

export const MOCK_FORM_SCHEMA_CHOICES = [ {
    "id": 1,
    "name": "new_slide_1",
    "label": "New Slide 1",
    "nodes": [
      {
        "id": 1001,
        "hint": null,
        "name": "case_name",
        "size": "normal",
        "label": "nome paziente",
        "parent": 1,
        "warning": {
          "conditions": []
        },
        "editable": false,
        "nodeType": 0,
        "fieldType": 1,
        "parentNode": 0,
        "validation": {
          "conditions": []
        },
        "visibility": {
          "condition": "true"
        },
        "description": null,
        "defaultValue": null,
        "conditionalBranches": [
          {
            "condition": "true"
          }
        ]
      },
      {
        "id": 1002,
        "hint": null,
        "name": "new_field_2",
        "size": "normal",
        "label": "età",
        "parent": 1001,
        "warning": {
          "conditions": []
        },
        "editable": true,
        "nodeType": 0,
        "fieldType": 2,
        "parentNode": 0,
        "validation": {
          "conditions": []
        },
        "visibility": {
          "condition": "true"
        },
        "description": null,
        "defaultValue": null,
        "conditionalBranches": [
          {
            "condition": "true"
          }
        ]
      },
      {
        "id": 1003,
        "hint": null,
        "name": "new_field_4",
        "size": "normal",
        "label": "migrante",
        "parent": 1002,
        "warning": {
          "conditions": []
        },
        "editable": true,
        "nodeType": 0,
        "fieldType": 3,
        "parentNode": 0,
        "validation": {
          "conditions": []
        },
        "visibility": {
          "condition": "true"
        },
        "description": null,
        "defaultValue": null,
        "conditionalBranches": [
          {
            "condition": "true"
          }
        ]
      },
      {
        "id": 1004,
        "hint": null,
        "name": "new_field_3",
        "size": "normal",
        "label": "problemi",
        "parent": 1003,
        "warning": {
          "conditions": []
        },
        "editable": true,
        "nodeType": 0,
        "fieldType": 5,
        "parentNode": 0,
        "validation": {
          "conditions": []
        },
        "visibility": {
          "condition": "true"
        },
        "description": null,
        "forceNarrow": false,
        "defaultValue": null,
        "forceExpanded": false,
        "choicesOriginRef": "probl",
        "triggerConditions": [],
        "conditionalBranches": [
          {
            "condition": "true"
          }
        ]
      },
      {
        "id": 1005,
        "hint": null,
        "name": "new_field_1",
        "size": "normal",
        "label": "Commenti",
        "parent": 1004,
        "warning": {
          "conditions": []
        },
        "editable": true,
        "nodeType": 0,
        "fieldType": 1,
        "parentNode": 0,
        "validation": {
          "conditions": []
        },
        "visibility": {
          "condition": "true"
        },
        "description": null,
        "defaultValue": null,
        "conditionalBranches": [
          {
            "condition": "true"
          }
        ]
      }
    ],
    "parent": 0,
    "nodeType": 3,
    "readonly": {
      "condition": "false"
    },
    "parentNode": 0,
    "visibility": {
      "condition": "true"
    },
    "conditionalBranches": [
      {
        "condition": "true"
      }
    ]
}
];

// Mock user profile
export const MOCK_USER_PROFILE: UserProfile = {
  id: "1",
  email: "demo@example.com",
  name: "Demo User",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-15T10:30:00Z"
};

// Mock server recordings
export const MOCK_SERVER_RECORDINGS: ServerRecording[] = [
  {
    id: "rec-1",
    name: "Project Kickoff Meeting",
    duration: 1800, // 30 minutes
    createdAt: "2024-01-10T14:00:00Z",
    uploadedAt: "2024-01-10T14:35:00Z",
    fileUrl: "https://example.com/recordings/rec-1.webm",
    status: "COMPLETED"
  },
  {
    id: "rec-2", 
    name: "Client Interview - User Research",
    duration: 2700, // 45 minutes
    createdAt: "2024-01-08T09:15:00Z",
    uploadedAt: "2024-01-08T10:05:00Z",
    fileUrl: "https://example.com/recordings/rec-2.webm",
    status: "COMPLETED"
  },
  {
    id: "rec-3",
    name: "Weekly Team Standup",
    duration: 900, // 15 minutes
    createdAt: "2024-01-05T10:00:00Z",
    uploadedAt: "2024-01-05T10:20:00Z",
    fileUrl: "https://example.com/recordings/rec-3.webm",
    status: "COMPLETED"
  }
];

// Mock GraphQL service class
export class MockGraphQLService {
  private static instance: MockGraphQLService;

  static getInstance(): MockGraphQLService {
    if (!MockGraphQLService.instance) {
      MockGraphQLService.instance = new MockGraphQLService();
    }
    return MockGraphQLService.instance;
  }

  async getUserProfile(): Promise<UserProfile> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_USER_PROFILE;
  }

  async getUserRecordings(): Promise<ServerRecording[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    return MOCK_SERVER_RECORDINGS;
  }

  async getFormSchema() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      schema: MOCK_FORM_SCHEMA,
      schemaName: MOCK_FORM_SCHEMA_NAME,
      exampleData: MOCK_FORM_SCHEMA_EXAMPLE_DATA,
      choices: MOCK_FORM_SCHEMA_CHOICES
    };
  }

  async uploadRecording(input: { name: string; duration: number; audioFile: File }) {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newRecording: ServerRecording = {
      id: `rec-${Date.now()}`,
      name: input.name,
      duration: input.duration,
      createdAt: new Date().toISOString(),
      uploadedAt: new Date().toISOString(),
      fileUrl: `https://example.com/recordings/rec-${Date.now()}.webm`,
      status: "COMPLETED"
    };

    // Add to mock data
    MOCK_SERVER_RECORDINGS.unshift(newRecording);
    
    return newRecording;
  }

  async deleteRecording(id: string): Promise<{ success: boolean; message: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = MOCK_SERVER_RECORDINGS.findIndex(r => r.id === id);
    if (index > -1) {
      MOCK_SERVER_RECORDINGS.splice(index, 1);
      return { success: true, message: "Recording deleted successfully" };
    }
    
    return { success: false, message: "Recording not found" };
  }
}
