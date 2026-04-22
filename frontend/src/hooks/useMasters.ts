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

export interface MasterItem {
  id: number | string;
  name: string;
  code?: string;
  is_active: boolean;
  [key: string]: unknown;
}

function makeMasterHooks(path: string, key: string) {
  return {
    useList: () =>
      useQuery({
        queryKey: ['masters', key],
        queryFn: async () => {
          const res = await api.get(`/masters/${path}/`);
          return extract<MasterItem>(res);
        },
        staleTime: 120_000,
      }),
    useCreate: () => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: async (data: Partial<MasterItem>) => {
          const res = await api.post(`/masters/${path}/`, data);
          return extractOne<MasterItem>(res);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['masters', key] }),
      });
    },
    useUpdate: () => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: async ({ id, ...data }: Partial<MasterItem> & { id: number | string }) => {
          const res = await api.patch(`/masters/${path}/${id}/`, data);
          return extractOne<MasterItem>(res);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['masters', key] }),
      });
    },
    useDelete: () => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: async (id: number | string) => {
          await api.delete(`/masters/${path}/${id}/`);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['masters', key] }),
      });
    },
  };
}

export const useDepartments = makeMasterHooks('departments', 'departments');
export const useDesignations = makeMasterHooks('designations', 'designations');
export const useEmploymentTypes = makeMasterHooks('employment-types', 'employment-types');
export const useCompanyLocations = makeMasterHooks('company-locations', 'company-locations');
export const useLeaveTypesMaster = makeMasterHooks('leave-types', 'leave-types');
export const useShiftTypes = makeMasterHooks('shift-types', 'shift-types');
export const useEmployeeStatuses = makeMasterHooks('employee-statuses', 'employee-statuses');
export const useEmployeeCategories = makeMasterHooks('employee-categories', 'employee-categories');
