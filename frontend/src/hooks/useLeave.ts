import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@api/client';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface LeaveTypeRef {
  id: string;
  name: string;
  code: string;
  color_code: string;
  is_paid: boolean;
}

export interface LeaveBalanceAPI {
  id: string;
  employee_code: string;
  leave_type: string;
  leave_type_detail: LeaveTypeRef;
  period_start: string;
  period_end: string;
  opening_balance: number;
  accrued: number;
  used: number;
  pending_approval: number;
  carry_forwarded: number;
  encashed: number;
  available: number;
  total_allocated: number;
}

export interface LeaveApplicationAPI {
  id: string;
  employee_code: string;
  employee_name: string;
  leave_type: string;
  leave_type_detail: LeaveTypeRef;
  from_date: string;
  to_date: string;
  from_half: string;
  to_half: string;
  total_days: number;
  reason: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'REVOKED';
  applied_on: string;
  approved_at: string | null;
}

export interface HolidayAPI {
  id: string;
  name: string;
  date: string;
  holiday_type: string;
  is_optional: boolean;
}

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

async function fetchMyBalances(): Promise<LeaveBalanceAPI[]> {
  const res = await api.get('/me/leave-balances/');
  return res.data?.results ?? res.data?.data ?? res.data ?? [];
}

async function fetchMyApplications(): Promise<LeaveApplicationAPI[]> {
  const res = await api.get('/me/leave-applications/');
  return res.data?.results ?? res.data?.data?.results ?? res.data?.data ?? res.data ?? [];
}

async function fetchUpcomingHolidays(): Promise<HolidayAPI[]> {
  const res = await api.get('/me/holidays/');
  return res.data?.results ?? res.data?.data ?? res.data ?? [];
}

async function fetchLeaveTypes(): Promise<LeaveTypeRef[]> {
  const res = await api.get('/me/leave-types/');
  return res.data?.results ?? res.data?.data?.results ?? res.data?.data ?? res.data ?? [];
}

export function useMyLeaveBalances() {
  return useQuery({
    queryKey: ['leave-balances-my'],
    queryFn: fetchMyBalances,
    staleTime: 2 * 60_000,
  });
}

export function useMyLeaveApplications() {
  return useQuery({
    queryKey: ['leave-applications-my'],
    queryFn: fetchMyApplications,
    staleTime: 2 * 60_000,
  });
}

export function useUpcomingHolidays() {
  return useQuery({
    queryKey: ['holidays-upcoming'],
    queryFn: fetchUpcomingHolidays,
    staleTime: 10 * 60_000,
  });
}

export function useLeaveTypes() {
  return useQuery({
    queryKey: ['leave-types'],
    queryFn: fetchLeaveTypes,
    staleTime: 10 * 60_000,
  });
}

export interface ApplyLeavePayload {
  leave_type: string;
  from_date: string;
  to_date: string;
  from_half: 'AM' | 'PM' | 'FULL';
  to_half: 'AM' | 'PM' | 'FULL';
  total_days: number;
  reason: string;
}

export function useApplyLeave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ApplyLeavePayload) => {
      const res = await api.post('/me/apply-leave/', payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leave-applications-my'] });
      qc.invalidateQueries({ queryKey: ['leave-balances-my'] });
    },
  });
}

/* ------------------------------------------------------------------ */
/*  Admin hooks (HRMS portal)                                          */
/* ------------------------------------------------------------------ */

async function fetchAllApplications(): Promise<LeaveApplicationAPI[]> {
  const res = await api.get('/leave/applications/');
  return res.data?.results ?? res.data?.data?.results ?? res.data?.data ?? res.data ?? [];
}

export function useAllLeaveApplications() {
  return useQuery({
    queryKey: ['leave-applications-all'],
    queryFn: fetchAllApplications,
    staleTime: 60_000,
  });
}

export function useApproveLeave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/leave/applications/${id}/approve/`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leave-applications-all'] });
      qc.invalidateQueries({ queryKey: ['leave-applications-my'] });
    },
  });
}

export function useRejectLeave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, remarks }: { id: string; remarks?: string }) => {
      const res = await api.post(`/leave/applications/${id}/reject/`, { remarks });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leave-applications-all'] });
      qc.invalidateQueries({ queryKey: ['leave-applications-my'] });
    },
  });
}
