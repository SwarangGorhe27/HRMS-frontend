import { useQuery } from '@tanstack/react-query';
import api from '@api/client';

function extract<T>(res: unknown): T[] {
  const d = res as Record<string, unknown>;
  return (d?.data as Record<string, unknown>)?.results as T[]
    ?? (d?.data as Record<string, unknown>)?.data as T[]
    ?? d?.data as T[]
    ?? d?.results as T[]
    ?? (Array.isArray(d) ? d : []) as T[];
}

export interface LifecycleEvent {
  id: string;
  event_type: string;
  event_date: string;
  effective_date: string | null;
  previous_value: string;
  new_value: string;
  remarks: string;
  approved_by: string | null;
  document: string | null;
  created_at: string;
  employee_name?: string;
  employee_code?: string;
}

export function useEmployeeLifecycle(employeeId: string) {
  return useQuery({
    queryKey: ['employees', employeeId, 'lifecycle'],
    queryFn: async () => {
      const res = await api.get(`/employees/${employeeId}/lifecycle/`);
      return extract<LifecycleEvent>(res);
    },
    enabled: !!employeeId,
  });
}

export function useAllLifecycleEvents() {
  return useQuery({
    queryKey: ['employees', 'lifecycle-all'],
    queryFn: async () => {
      // Fetch all employees and aggregate their lifecycle events
      const empRes = await api.get('/employees/');
      const emps = ((empRes as unknown) as Record<string, unknown>)?.data as Record<string, unknown>;
      const list = (emps?.results ?? emps?.data ?? emps ?? []) as Array<{ id: string; full_name?: string; employee_code?: string }>;
      return list.slice(0, 30); // return employee list for lifecycle panel to iterate
    },
    staleTime: 60_000,
  });
}
