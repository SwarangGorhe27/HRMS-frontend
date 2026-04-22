import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@api/client';

function extract<T>(res: unknown): T[] {
  const d = res as Record<string, unknown>;
  return (d?.data as Record<string, unknown>)?.results as T[]
    ?? (d?.data as Record<string, unknown>)?.data as T[]
    ?? d?.data as T[]
    ?? d?.results as T[]
    ?? (Array.isArray(d) ? d : []) as T[];
}

function extractOne<T>(res: unknown): T {
  const d = res as Record<string, unknown>;
  return ((d?.data as Record<string, unknown>)?.data ?? d?.data ?? d) as T;
}

export function useMyDocuments() {
  return useQuery({
    queryKey: ['me', 'documents'],
    queryFn: async () => {
      const res = await api.get('/me/documents/');
      return extract<Record<string, unknown>>(res);
    },
  });
}

export function useUploadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/me/upload-document/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return extractOne<Record<string, unknown>>(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me', 'documents'] });
    },
  });
}

/* ------------------------------------------------------------------ */
/*  Admin hooks (HRMS portal)                                          */
/* ------------------------------------------------------------------ */

export function useAllDocuments() {
  return useQuery({
    queryKey: ['admin', 'documents'],
    queryFn: async () => {
      const res = await api.get('/documents/documents/');
      return extract<Record<string, unknown>>(res);
    },
    staleTime: 60_000,
  });
}

export function useAdminUploadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/documents/documents/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return extractOne<Record<string, unknown>>(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'documents'] });
      qc.invalidateQueries({ queryKey: ['me', 'documents'] });
    },
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/documents/documents/${id}/`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'documents'] });
      qc.invalidateQueries({ queryKey: ['me', 'documents'] });
    },
  });
}

