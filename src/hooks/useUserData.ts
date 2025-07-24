import { useQuery } from '@apollo/client';
import { GET_USER_PROFILE, GET_USER_RECORDINGS } from '../graphql/queries';
import { UserProfile, ServerRecording } from '../types/graphql';

export const useUserProfile = () => {
  const { data, loading, error, refetch } = useQuery<{ me: UserProfile }>(GET_USER_PROFILE, {
    errorPolicy: 'all',
  });

  return {
    userProfile: data?.me,
    loading,
    error,
    refetch,
  };
};

export const useUserRecordings = () => {
  const { data, loading, error, refetch } = useQuery<{ myRecordings: ServerRecording[] }>(GET_USER_RECORDINGS, {
    errorPolicy: 'all',
  });

  return {
    recordings: data?.myRecordings || [],
    loading,
    error,
    refetch,
  };
};
