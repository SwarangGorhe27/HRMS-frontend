import { useQuery } from '@tanstack/react-query';
import api from '@api/client';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AttendanceRecordAPI {
  id: string;
  employee_code: string;
  employee_name: string;
  date: string;
  shift_name: string;
  first_in: string | null;
  last_out: string | null;
  effective_hours: string | null;
  late_mins: number;
  early_leave_mins: number;
  overtime_mins: number;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE' | 'HOLIDAY' | 'WEEK_OFF' | 'ON_DUTY' | 'NOT_COMPUTED';
  is_regularized: boolean;
  remarks: string;
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

async function fetchAttendanceRecords(month: number, year: number): Promise<AttendanceRecordAPI[]> {
  const res = await api.get('/me/attendance/', {
    params: { month, year },
  });
  return res.data?.results ?? res.data?.data?.results ?? res.data?.data ?? res.data ?? [];
}

async function fetchHolidays(): Promise<HolidayAPI[]> {
  const res = await api.get('/me/holidays/');
  return res.data?.results ?? res.data?.data ?? res.data ?? [];
}

export function useAttendanceRecords(month: number, year: number) {
  return useQuery({
    queryKey: ['attendance-records', year, month],
    queryFn: () => fetchAttendanceRecords(month, year),
    staleTime: 2 * 60_000,
  });
}

export function useUpcomingHolidays() {
  return useQuery({
    queryKey: ['holidays-upcoming'],
    queryFn: fetchHolidays,
    staleTime: 10 * 60_000,
  });
}
