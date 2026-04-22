import { useQuery } from '@tanstack/react-query';
import api from '@api/client';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface MasterRef {
  id: string;
  name: string;
  code: string;
}

export interface ContactInfo {
  id: string;
  personal_email: string;
  work_email: string;
  personal_mobile: string;
  work_mobile: string;
  home_phone: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  emergency_contact_relation_detail?: MasterRef;
}

export interface AddressInfo {
  id: string;
  address_type: 'CURRENT' | 'PERMANENT' | 'TEMPORARY';
  address_line1: string;
  address_line2: string;
  landmark: string;
  city: string | null;
  state: string | null;
  country: string | null;
  pincode: string;
}

export interface EmploymentInfo {
  id: string;
  department_detail?: MasterRef;
  designation_detail?: MasterRef;
  employment_type_detail?: MasterRef;
  employee_category_detail?: MasterRef;
  company_location_detail?: MasterRef;
  date_of_joining: string;
  date_of_confirmation: string | null;
  probation_end_date: string | null;
  notice_period_days: number;
  date_of_exit: string | null;
}

export interface FamilyMemberInfo {
  id: string;
  name: string;
  relation_detail?: MasterRef;
  date_of_birth: string | null;
  gender: string | null;
  is_dependent: boolean;
  is_emergency_contact: boolean;
  phone: string;
  occupation: string;
}

export interface EducationInfo {
  id: string;
  qualification_detail?: MasterRef;
  qualification_type_detail?: MasterRef;
  university_detail?: MasterRef;
  institution_name: string;
  specialization: string;
  year_of_passing: number | null;
  percentage_or_cgpa: string;
  grade: string;
}

export interface BankInfo {
  id: string;
  bank_detail?: MasterRef;
  branch_detail?: MasterRef;
  account_number: string;
  ifsc_code: string;
  account_holder_name: string;
  account_type: string;
  is_primary: boolean;
}

export interface LanguageInfo {
  id: string;
  language_detail?: MasterRef;
  can_read: boolean;
  can_write: boolean;
  can_speak: boolean;
  proficiency_level: string;
}

export interface LifecycleEvent {
  id: string;
  event_type: string;
  event_date: string;
  effective_date: string;
  remarks: string;
  previous_value: string;
  new_value: string;
}

export interface NomineeInfo {
  id: string;
  name: string;
  relation_detail?: MasterRef;
  percentage: string;
  phone: string;
}

export interface ReportingInfo {
  id: string;
  reporting_manager_name: string;
  functional_manager_name: string;
  hr_partner_name: string;
  is_current: boolean;
}

export interface SystemAccessInfo {
  id: string;
  biometric_id: string;
  access_card_number: string;
  can_login: boolean;
  can_use_mobile_app: boolean;
  can_use_web_checkin: boolean;
}

export interface MyProfileData {
  id: string;
  employee_code: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  date_of_birth: string;
  profile_photo: string | null;
  gender_detail?: MasterRef;
  blood_group_detail?: MasterRef;
  marital_status_detail?: MasterRef;
  nationality_detail?: MasterRef;
  religion_detail?: MasterRef;
  caste_detail?: MasterRef;
  status_detail?: MasterRef;
  pan_number: string;
  aadhaar_number: string;
  passport_number: string;
  uan_number: string;
  contact?: ContactInfo;
  addresses: AddressInfo[];
  employment?: EmploymentInfo;
  system_access?: SystemAccessInfo;
  lifecycle_events: LifecycleEvent[];
  current_reporting?: ReportingInfo;
  family_members: FamilyMemberInfo[];
  nominees: NomineeInfo[];
  education: EducationInfo[];
  languages: LanguageInfo[];
  bank_details: BankInfo[];
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

async function fetchMyProfile(): Promise<MyProfileData> {
  const response = await api.get('/me/');
  return response.data?.data ?? response.data;
}

export function useMyProfile() {
  return useQuery({
    queryKey: ['my-profile'],
    queryFn: fetchMyProfile,
    staleTime: 5 * 60_000,
  });
}
