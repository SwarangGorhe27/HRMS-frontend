import { useQuery } from '@tanstack/react-query';
import api from '@api/client';

export interface DashboardData {
  employees: {
    total: number;
    active: number;
    on_leave: number;
    new_hires_this_month: number;
  };
  departments: Array<{ name: string; count: number }>;
  attendance: {
    present_today: number;
    absent_today: number;
    late_today: number;
    attendance_rate: number;
    daily_trend: Array<{ date: string; present: number }>;
  };
  leave: {
    pending_approvals: number;
  };
  upcoming_birthdays: Array<{ name: string; code: string; date: string }>;
  recent_employees: Array<{
    id: string;
    code: string;
    name: string;
    status: string;
    department: string;
    designation: string;
    location: string;
  }>;
}

async function fetchDashboard(): Promise<DashboardData> {
  const response = await api.get('/dashboard/');
  // The API wraps in { success, data, meta, errors }
  return response.data?.data ?? response.data;
}

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    refetchInterval: 60_000, // refresh every 60s
    staleTime: 30_000,
  });
}
