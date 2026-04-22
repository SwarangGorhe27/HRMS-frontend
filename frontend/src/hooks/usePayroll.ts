import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export function useMyPayslips() {
  return useQuery({
    queryKey: ['me', 'payslips'],
    queryFn: async () => {
      const res = await api.get('/me/payslips/');
      return extract<Record<string, unknown>>(res);
    },
  });
}

export function useMySalary() {
  return useQuery({
    queryKey: ['me', 'salary'],
    queryFn: async () => {
      const res = await api.get('/me/salary/');
      return extractOne<Record<string, unknown>>(res);
    },
  });
}

/* ------------------------------------------------------------------ */
/*  Admin hooks (HRMS portal)                                          */
/* ------------------------------------------------------------------ */

export interface PayrollRunAPI {
  id: string;
  name: string;
  run_type: string;
  period_start: string;
  period_end: string;
  status: 'DRAFT' | 'COMPUTING' | 'COMPUTED' | 'FINALIZED' | 'PUBLISHED';
  total_employees: number;
  total_gross: string | number;
  total_net: string | number;
  created_at: string;
}

export function usePayrollRuns() {
  return useQuery({
    queryKey: ['payroll-runs'],
    queryFn: async () => {
      const res = await api.get('/payroll/runs/');
      return extract<PayrollRunAPI>(res);
    },
    staleTime: 60_000,
  });
}

export function useComputePayrollRun() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/payroll/runs/${id}/compute/`);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payroll-runs'] }),
  });
}

export function useFinalizePayrollRun() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/payroll/runs/${id}/finalize/`);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payroll-runs'] }),
  });
}

export function usePublishPayslips() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/payroll/runs/${id}/publish-payslips/`);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payroll-runs'] }),
  });
}
