import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@api/client';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AdminAttendanceRecord {
  id: string;
  employee: string;
  employee_code: string;
  employee_name: string;
  date: string;
  shift: string | null;
  shift_name: string;
  first_in: string | null;
  last_out: string | null;
  effective_hours: string | null;
  late_mins: number;
  early_leave_mins: number;
  overtime_mins: number;
  status: string;
  is_regularized: boolean;
  remarks: string;
  is_admin_edited: boolean;
  admin_edit_reason: string;
  admin_edited_at: string | null;
  original_first_in: string | null;
  original_last_out: string | null;
  original_status: string;
  last_changed_by_source: string;
  regularization_ref: string | null;
}

export interface AttendanceEditLogEntry {
  id: string;
  attendance_record: string;
  employee: string;
  date: string;
  field_changed: string;
  old_value: string;
  new_value: string;
  change_source: string;
  changed_by: string;
  changed_by_name: string;
  changed_by_code: string;
  reason: string;
  regularization_request: string | null;
  ip_address: string | null;
  created_at: string;
}

export interface OverridePayload {
  first_in?: string | null;
  last_out?: string | null;
  status?: string;
  reason: string;
}

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

async function fetchAdminRecords(params: Record<string, string>): Promise<AdminAttendanceRecord[]> {
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/attendance/admin/records/?${query}`);
  return res.data?.results ?? res.data?.data?.results ?? res.data?.data ?? res.data ?? [];
}

async function fetchAuditLog(recordId: string): Promise<AttendanceEditLogEntry[]> {
  const res = await api.get(`/attendance/admin/records/${recordId}/audit-log/`);
  return res.data?.results ?? res.data?.data ?? res.data ?? [];
}

export function useAdminAttendanceRecords(filters: Record<string, string>) {
  return useQuery({
    queryKey: ['admin-attendance-records', filters],
    queryFn: () => fetchAdminRecords(filters),
    staleTime: 30_000,
  });
}

export function useAttendanceAuditLog(recordId: string | null) {
  return useQuery({
    queryKey: ['attendance-audit-log', recordId],
    queryFn: () => fetchAuditLog(recordId!),
    enabled: !!recordId,
    staleTime: 10_000,
  });
}

export function useAttendanceOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ recordId, payload }: { recordId: string; payload: OverridePayload }) => {
      const res = await api.patch(`/attendance/admin/records/${recordId}/override/`, payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-attendance-records'] });
      qc.invalidateQueries({ queryKey: ['attendance-audit-log'] });
    },
  });
}
