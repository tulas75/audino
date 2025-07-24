import { useState, useEffect } from 'react';
import { UserProfile, ServerRecording } from '../types/graphql';
import { MockGraphQLService } from '../services/mockGraphql';

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const mockService = MockGraphQLService.getInstance();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profile = await mockService.getUserProfile();
      setUserProfile(profile);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    userProfile,
    loading,
    error,
    refetch: fetchProfile,
  };
};

export const useUserRecordings = () => {
  const [recordings, setRecordings] = useState<ServerRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const mockService = MockGraphQLService.getInstance();

  const fetchRecordings = async () => {
    try {
      setLoading(true);
      setError(null);
      const serverRecordings = await mockService.getUserRecordings();
      setRecordings(serverRecordings);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  return {
    recordings,
    loading,
    error,
    refetch: fetchRecordings,
  };
};

export const useFormSchema = () => {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const mockService = MockGraphQLService.getInstance();

  const fetchFormSchema = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mockService.getFormSchema();
      setFormData(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormSchema();
  }, []);

  return {
    formSchema: formData?.schema,
    formSchemaName: formData?.schemaName,
    formSchemaExampleData: formData?.exampleData,
    formSchemaChoices: formData?.choices,
    loading,
    error,
    refetch: fetchFormSchema,
  };
};
