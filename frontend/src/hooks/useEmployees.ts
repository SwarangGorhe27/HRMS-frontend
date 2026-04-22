import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@api/client';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface EmployeeListItem {
  id: string;
  employee_code: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  profile_photo: string | null;
  status: string;
  status_detail: { id: string; name: string; code: string; color_code: string } | null;
  department: string;
  designation: string;
  date_of_joining: string | null;
  work_email: string;
}

export interface MasterOption {
  id: string;
  name: string;
  code: string;
}

export interface InviteEmployeePayload {
  first_name: string;
  last_name: string;
  middle_name?: string;
  work_email: string;
  personal_mobile: string;
  gender: string;
  department: string;
  designation: string;
  employment_type?: string;
  date_of_joining: string;
}

export interface InviteResponse extends EmployeeListItem {
  invite_token: string;
  invite_link: string;
}

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

async function fetchEmployees(): Promise<EmployeeListItem[]> {
  const res = await api.get('/employees/');
  return res.data?.results ?? res.data?.data?.results ?? res.data?.data ?? res.data ?? [];
}

async function fetchMaster(endpoint: string): Promise<MasterOption[]> {
  const res = await api.get(`/masters/${endpoint}/`);
  return res.data?.results ?? res.data?.data?.results ?? res.data?.data ?? res.data ?? [];
}

export function useEmployeeList() {
  return useQuery({
    queryKey: ['employees-list'],
    queryFn: fetchEmployees,
    staleTime: 60_000,
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: ['masters-departments'],
    queryFn: () => fetchMaster('departments'),
    staleTime: 10 * 60_000,
  });
}

export function useDesignations() {
  return useQuery({
    queryKey: ['masters-designations'],
    queryFn: () => fetchMaster('designations'),
    staleTime: 10 * 60_000,
  });
}

export function useGenders() {
  return useQuery({
    queryKey: ['masters-genders'],
    queryFn: () => fetchMaster('genders'),
    staleTime: 10 * 60_000,
  });
}

export function useEmploymentTypes() {
  return useQuery({
    queryKey: ['masters-employment-types'],
    queryFn: () => fetchMaster('employment-types'),
    staleTime: 10 * 60_000,
  });
}

export function useInviteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: InviteEmployeePayload): Promise<InviteResponse> => {
      const res = await api.post('/employees/invite/', payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees-list'] });
    },
  });
}
