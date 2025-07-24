import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    me {
      id
      email
      name
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_RECORDINGS = gql`
  query GetUserRecordings {
    myRecordings {
      id
      name
      duration
      createdAt
      uploadedAt
      fileUrl
      status
    }
  }
`;

export const UPLOAD_AUDIO_RECORDING = gql`
  mutation UploadAudioRecording($input: AudioUploadInput!) {
    uploadAudioRecording(input: $input) {
      id
      name
      duration
      fileUrl
      status
      uploadedAt
    }
  }
`;

export const DELETE_RECORDING = gql`
  mutation DeleteRecording($id: ID!) {
    deleteRecording(id: $id) {
      success
      message
    }
  }
`;
