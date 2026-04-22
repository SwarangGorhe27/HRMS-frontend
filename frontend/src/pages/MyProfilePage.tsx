import { useState } from 'react';
import {
  BookOpen,
  Briefcase,
  CreditCard,
  Fingerprint,
  GraduationCap,
  Landmark,
  Languages,
  MapPin,
  MapPinned,
  Shield,
  User,
  UserRound,
  Users,
} from 'lucide-react';
import { useMyProfile } from '@hooks/useMyProfile';
import type { MyProfileData } from '@hooks/useMyProfile';
import { Avatar, Badge } from '@components/ui';
import { cn } from '@utils/utils';

/* ------------------------------------------------------------------ */
/*  Sidebar sections                                                   */
/* ------------------------------------------------------------------ */

type SectionId =
  | 'profile'
  | 'personal'
  | 'employment'
  | 'address'
  | 'family'
  | 'education'
  | 'bank'
  | 'nominee'
  | 'language'
  | 'system';

interface SidebarItem {
  id: SectionId;
  label: string;
  icon: React.ElementType;
}

const sidebarItems: SidebarItem[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'personal', label: 'Personal', icon: UserRound },
  { id: 'employment', label: 'Employment & Job', icon: Briefcase },
  { id: 'address', label: 'Address', icon: MapPin },
  { id: 'family', label: 'Family', icon: Users },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'bank', label: 'Accounts & Statutory', icon: Landmark },
  { id: 'nominee', label: 'Nominees', icon: Shield },
  { id: 'language', label: 'Languages', icon: Languages },
  { id: 'system', label: 'System Access', icon: Fingerprint },
];

/* ------------------------------------------------------------------ */
/*  Info field component                                               */
/* ------------------------------------------------------------------ */

function InfoField({ label, value, masked }: { label: string; value?: string | null; masked?: boolean }) {
  const [revealed, setRevealed] = useState(false);
  const display = value || '—';
  const maskedDisplay =
    masked && !revealed && value
      ? value.slice(0, -4).replace(/./g, 'X') + value.slice(-4)
      : display;

  return (
    <div className="min-w-0">
      <p className="text-xs text-surface-500 dark:text-white/40">{label}</p>
      <div className="mt-0.5 flex items-center gap-1.5">
        <p className="text-sm font-medium text-surface-900 dark:text-white">{maskedDisplay}</p>
        {masked && value && (
          <button
            type="button"
            onClick={() => setRevealed(!revealed)}
            className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            {revealed ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Card                                                       */
/* ------------------------------------------------------------------ */

function SectionCard({
  id,
  title,
  icon: Icon,
  children,
  collapsible = true,
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(true);

  return (
    <section id={id} className="surface-card scroll-mt-6 rounded-2xl">
      <button
        type="button"
        className="flex w-full items-center justify-between px-6 py-4"
        onClick={() => collapsible && setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10">
            <Icon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          </div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-surface-700 dark:text-white/80">
            {title}
          </h2>
        </div>
        {collapsible && (
          <svg
            className={cn('h-4 w-4 text-surface-400 transition-transform dark:text-white/30', open && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
      {open && <div className="border-t border-surface-100 px-6 py-5 dark:border-white/5">{children}</div>}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Jump-to links                                                      */
/* ------------------------------------------------------------------ */

function JumpLinks({ active }: { active: SectionId }) {
  return (
    <div className="flex flex-wrap gap-1 text-xs">
      <span className="text-surface-400 dark:text-white/30">JUMP TO</span>
      {sidebarItems.slice(0, 5).map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={cn(
            'px-1 transition-colors',
            active === item.id
              ? 'font-semibold text-brand-600 dark:text-brand-400'
              : 'text-brand-500 hover:text-brand-700 dark:text-brand-400/70 dark:hover:text-brand-300'
          )}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton loader                                                    */
/* ------------------------------------------------------------------ */

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="surface-card rounded-2xl p-6">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-surface-200 dark:bg-white/10" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-48 rounded bg-surface-200 dark:bg-white/10" />
            <div className="h-4 w-32 rounded bg-surface-200 dark:bg-white/10" />
          </div>
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="surface-card rounded-2xl p-6">
          <div className="h-4 w-32 rounded bg-surface-200 dark:bg-white/10" />
          <div className="mt-4 grid grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((j) => (
              <div key={j} className="space-y-2">
                <div className="h-3 w-20 rounded bg-surface-200 dark:bg-white/10" />
                <div className="h-4 w-28 rounded bg-surface-200 dark:bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Format helpers                                                     */
/* ------------------------------------------------------------------ */

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/* ------------------------------------------------------------------ */
/*  Profile Section                                                    */
/* ------------------------------------------------------------------ */

function ProfileSection({ data }: { data: MyProfileData }) {
  return (
    <SectionCard id="profile" title="Profile" icon={User} collapsible={false}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Avatar name={data.full_name} size="2xl" />
        <div className="grid flex-1 gap-5 sm:grid-cols-3">
          <InfoField label="Name" value={data.full_name} />
          <InfoField label="Employee ID" value={data.employee_code} />
          <InfoField label="Company Email" value={data.contact?.work_email} />
          <InfoField label="Location" value={data.employment?.company_location_detail?.name} />
          <InfoField label="Primary Contact No." value={data.contact?.personal_mobile} masked />
          <InfoField label="Department" value={data.employment?.department_detail?.name} />
        </div>
      </div>
    </SectionCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Personal Section                                                   */
/* ------------------------------------------------------------------ */

function PersonalSection({ data }: { data: MyProfileData }) {
  return (
    <SectionCard id="personal" title="Personal" icon={UserRound}>
      <div className="grid gap-5 sm:grid-cols-3">
        <InfoField label="Blood Group" value={data.blood_group_detail?.name} masked />
        <InfoField label="Date of Birth" value={formatDate(data.date_of_birth)} masked />
        <InfoField label="Nationality" value={data.nationality_detail?.name} />
        <InfoField label="Marital Status" value={data.marital_status_detail?.name} masked />
        <InfoField label="Religion" value={data.religion_detail?.name} />
        <InfoField label="Gender" value={data.gender_detail?.name} />
        <InfoField label="PAN Number" value={data.pan_number} masked />
        <InfoField label="Aadhaar Number" value={data.aadhaar_number} masked />
        <InfoField label="Passport Number" value={data.passport_number} />
        <InfoField label="UAN Number" value={data.uan_number} />
      </div>
    </SectionCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Employment Section                                                 */
/* ------------------------------------------------------------------ */

function EmploymentSection({ data }: { data: MyProfileData }) {
  const emp = data.employment;
  const reporting = data.current_reporting;

  return (
    <SectionCard id="employment" title="Employment & Job" icon={Briefcase}>
      <div className="grid gap-5 sm:grid-cols-3">
        <InfoField label="Department" value={emp?.department_detail?.name} />
        <InfoField label="Designation" value={emp?.designation_detail?.name} />
        <InfoField label="Employment Type" value={emp?.employment_type_detail?.name} />
        <InfoField label="Date of Joining" value={formatDate(emp?.date_of_joining)} />
        <InfoField label="Date of Confirmation" value={formatDate(emp?.date_of_confirmation)} />
        <InfoField label="Probation End Date" value={formatDate(emp?.probation_end_date)} />
        <InfoField label="Notice Period" value={emp?.notice_period_days ? `${emp.notice_period_days} days` : '—'} />
        <InfoField label="Employee Category" value={emp?.employee_category_detail?.name} />
        <InfoField label="Work Location" value={emp?.company_location_detail?.name} />
        {reporting && (
          <>
            <InfoField label="Reporting Manager" value={reporting.reporting_manager_name} />
            <InfoField label="Functional Manager" value={reporting.functional_manager_name || '—'} />
            <InfoField label="HR Partner" value={reporting.hr_partner_name || '—'} />
          </>
        )}
      </div>
    </SectionCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Address Section                                                    */
/* ------------------------------------------------------------------ */

function AddressSection({ data }: { data: MyProfileData }) {
  const [selectedType, setSelectedType] = useState('CURRENT');
  const address = data.addresses.find((a) => a.address_type === selectedType) ?? data.addresses[0];
  const typeLabel: Record<string, string> = {
    CURRENT: 'Current Address',
    PERMANENT: 'Permanent Address',
    TEMPORARY: 'Temporary Address',
  };

  return (
    <SectionCard id="address" title="Address" icon={MapPinned}>
      {data.addresses.length > 1 && (
        <div className="mb-5 flex gap-2">
          {data.addresses.map((a) => (
            <button
              key={a.address_type}
              type="button"
              onClick={() => setSelectedType(a.address_type)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                selectedType === a.address_type
                  ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-500/10 dark:text-brand-300'
                  : 'border-surface-300 text-surface-600 hover:border-surface-400 dark:border-white/10 dark:text-white/50'
              )}
            >
              {typeLabel[a.address_type] ?? a.address_type}
            </button>
          ))}
        </div>
      )}
      {address ? (
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <InfoField
              label={typeLabel[address.address_type] ?? 'Address'}
              value={[address.address_line1, address.address_line2].filter(Boolean).join(', ')}
            />
          </div>
          <InfoField label="Landmark" value={address.landmark} />
          <InfoField label="Pincode" value={address.pincode} />
        </div>
      ) : (
        <p className="text-sm text-surface-400 dark:text-white/30">No address on record.</p>
      )}
    </SectionCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Family Section                                                     */
/* ------------------------------------------------------------------ */

function FamilySection({ data }: { data: MyProfileData }) {
  return (
    <SectionCard id="family" title="Family" icon={Users}>
      {data.family_members.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-100 text-left text-xs text-surface-500 dark:border-white/5 dark:text-white/40">
                <th className="pb-3 pr-4 font-medium">Name</th>
                <th className="pb-3 pr-4 font-medium">Relation</th>
                <th className="pb-3 pr-4 font-medium">Date of Birth</th>
                <th className="pb-3 pr-4 font-medium">Occupation</th>
                <th className="pb-3 pr-4 font-medium">Phone</th>
                <th className="pb-3 font-medium">Dependent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-white/5">
              {data.family_members.map((fm) => (
                <tr key={fm.id}>
                  <td className="py-3 pr-4 font-medium text-surface-900 dark:text-white">{fm.name}</td>
                  <td className="py-3 pr-4 text-surface-600 dark:text-white/60">{fm.relation_detail?.name ?? '—'}</td>
                  <td className="py-3 pr-4 text-surface-600 dark:text-white/60">{formatDate(fm.date_of_birth)}</td>
                  <td className="py-3 pr-4 text-surface-600 dark:text-white/60">{fm.occupation || '—'}</td>
                  <td className="py-3 pr-4 text-surface-600 dark:text-white/60">{fm.phone || '—'}</td>
                  <td className="py-3">
                    <Badge variant={fm.is_dependent ? 'warning' : 'neutral'} size="sm">
                      {fm.is_dependent ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-surface-400 dark:text-white/30">No family members on record.</p>
      )}
    </SectionCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Education Section                                                  */
/* ------------------------------------------------------------------ */

function EducationSection({ data }: { data: MyProfileData }) {
  return (
    <SectionCard id="education" title="Education" icon={GraduationCap}>
      {data.education.length > 0 ? (
        <div className="space-y-4">
          {data.education.map((ed) => (
            <div
              key={ed.id}
              className="flex items-start gap-4 rounded-xl border border-surface-100 p-4 dark:border-white/5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10">
                <BookOpen className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-surface-900 dark:text-white">
                    {ed.qualification_detail?.name ?? 'Qualification'}
                  </p>
                  {ed.grade && (
                    <Badge variant="brand" size="sm">
                      Grade: {ed.grade}
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-surface-600 dark:text-white/55">
                  {[ed.specialization, ed.institution_name].filter(Boolean).join(' — ')}
                </p>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-surface-500 dark:text-white/40">
                  {ed.university_detail && <span>{ed.university_detail.name}</span>}
                  {ed.year_of_passing && <span>Passed: {ed.year_of_passing}</span>}
                  {ed.percentage_or_cgpa && <span>{ed.percentage_or_cgpa}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-surface-400 dark:text-white/30">No education records.</p>
      )}
    </SectionCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Bank / Statutory Section                                           */
/* ------------------------------------------------------------------ */

function BankSection({ data }: { data: MyProfileData }) {
  return (
    <SectionCard id="bank" title="Accounts & Statutory" icon={Landmark}>
      {data.bank_details.length > 0 ? (
        <div className="space-y-4">
          {data.bank_details.map((bd) => (
            <div
              key={bd.id}
              className="rounded-xl border border-surface-100 p-4 dark:border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
                  <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-surface-900 dark:text-white">
                    {bd.bank_detail?.name ?? 'Bank'}
                  </p>
                  <p className="text-xs text-surface-500 dark:text-white/40">
                    {bd.branch_detail?.name ?? ''} {bd.is_primary && '· Primary Account'}
                  </p>
                </div>
                {bd.is_primary && (
                  <Badge variant="success" size="sm" className="ml-auto">
                    Primary
                  </Badge>
                )}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <InfoField label="Account Number" value={bd.account_number} masked />
                <InfoField label="IFSC Code" value={bd.ifsc_code} />
                <InfoField label="Account Holder" value={bd.account_holder_name} />
                <InfoField label="Account Type" value={bd.account_type} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-surface-400 dark:text-white/30">No bank details on record.</p>
      )}
      {/* Statutory IDs */}
      <div className="mt-6 border-t border-surface-100 pt-5 dark:border-white/5">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-white/40">
          Statutory Information
        </h3>
        <div className="grid gap-5 sm:grid-cols-3">
          <InfoField label="PAN Number" value={data.pan_number} masked />
          <InfoField label="Aadhaar Number" value={data.aadhaar_number} masked />
          <InfoField label="UAN Number" value={data.uan_number} />
          <InfoField label="Passport Number" value={data.passport_number} />
        </div>
      </div>
    </SectionCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Nominee Section                                                    */
/* ------------------------------------------------------------------ */

function NomineeSection({ data }: { data: MyProfileData }) {
  return (
    <SectionCard id="nominee" title="Nominees" icon={Shield}>
      {data.nominees.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-100 text-left text-xs text-surface-500 dark:border-white/5 dark:text-white/40">
                <th className="pb-3 pr-4 font-medium">Name</th>
                <th className="pb-3 pr-4 font-medium">Relation</th>
                <th className="pb-3 pr-4 font-medium">Share %</th>
                <th className="pb-3 font-medium">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-white/5">
              {data.nominees.map((n) => (
                <tr key={n.id}>
                  <td className="py-3 pr-4 font-medium text-surface-900 dark:text-white">{n.name}</td>
                  <td className="py-3 pr-4 text-surface-600 dark:text-white/60">{n.relation_detail?.name ?? '—'}</td>
                  <td className="py-3 pr-4 text-surface-600 dark:text-white/60">{n.percentage}%</td>
                  <td className="py-3 text-surface-600 dark:text-white/60">{n.phone || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-surface-400 dark:text-white/30">No nominees on record.</p>
      )}
    </SectionCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Language Section                                                   */
/* ------------------------------------------------------------------ */

function LanguageSection({ data }: { data: MyProfileData }) {
  return (
    <SectionCard id="language" title="Languages" icon={Languages}>
      {data.languages.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-100 text-left text-xs text-surface-500 dark:border-white/5 dark:text-white/40">
                <th className="pb-3 pr-4 font-medium">Language</th>
                <th className="pb-3 pr-4 font-medium">Proficiency</th>
                <th className="pb-3 pr-4 font-medium">Read</th>
                <th className="pb-3 pr-4 font-medium">Write</th>
                <th className="pb-3 font-medium">Speak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-white/5">
              {data.languages.map((lang) => (
                <tr key={lang.id}>
                  <td className="py-3 pr-4 font-medium text-surface-900 dark:text-white">
                    {lang.language_detail?.name ?? '—'}
                  </td>
                  <td className="py-3 pr-4">
                    <Badge
                      variant={
                        lang.proficiency_level === 'NATIVE'
                          ? 'success'
                          : lang.proficiency_level === 'ADVANCED'
                            ? 'brand'
                            : 'neutral'
                      }
                      size="sm"
                    >
                      {lang.proficiency_level}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 text-surface-600 dark:text-white/60">{lang.can_read ? '✓' : '—'}</td>
                  <td className="py-3 pr-4 text-surface-600 dark:text-white/60">{lang.can_write ? '✓' : '—'}</td>
                  <td className="py-3 text-surface-600 dark:text-white/60">{lang.can_speak ? '✓' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-surface-400 dark:text-white/30">No language records.</p>
      )}
    </SectionCard>
  );
}

/* ------------------------------------------------------------------ */
/*  System Access Section                                              */
/* ------------------------------------------------------------------ */

function SystemSection({ data }: { data: MyProfileData }) {
  const sa = data.system_access;
  if (!sa) return null;

  return (
    <SectionCard id="system" title="System Access" icon={Fingerprint}>
      <div className="grid gap-5 sm:grid-cols-3">
        <InfoField label="Biometric ID" value={sa.biometric_id} />
        <InfoField label="Access Card" value={sa.access_card_number} />
        <InfoField label="Web Login" value={sa.can_login ? 'Enabled' : 'Disabled'} />
        <InfoField label="Mobile App" value={sa.can_use_mobile_app ? 'Enabled' : 'Disabled'} />
        <InfoField label="Web Check-in" value={sa.can_use_web_checkin ? 'Enabled' : 'Disabled'} />
      </div>
    </SectionCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Main: My Profile Page                                              */
/* ------------------------------------------------------------------ */

export function MyProfilePage() {
  const { data, isLoading, isError } = useMyProfile();
  const [activeSection, setActiveSection] = useState<SectionId>('profile');

  if (isLoading) return <ProfileSkeleton />;

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <User className="h-10 w-10 text-surface-400 dark:text-white/30" />
        <p className="mt-3 text-sm text-surface-600 dark:text-white/50">Unable to load your profile.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* ── Sidebar ─────────────────────────────────── */}
      <aside className="sticky top-6 hidden h-fit w-56 shrink-0 lg:block">
        <div className="surface-card rounded-2xl p-4">
          <div className="mb-4 flex flex-col items-center gap-2 border-b border-surface-100 pb-4 dark:border-white/5">
            <Avatar name={data.full_name} size="xl" />
            <div className="text-center">
              <p className="text-sm font-semibold text-surface-900 dark:text-white">
                Hi {data.first_name}
              </p>
              <button
                type="button"
                className="mt-1 text-2xs text-brand-600 underline-offset-2 hover:underline dark:text-brand-400"
              >
                View My Info
              </button>
            </div>
          </div>
          <nav className="space-y-0.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors',
                    activeSection === item.id
                      ? 'bg-brand-50 font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                      : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-white/55 dark:hover:bg-white/5 dark:hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────── */}
      <div className="min-w-0 flex-1 space-y-4">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-surface-900 dark:text-white">
              Employee Information
            </h1>
            <JumpLinks active={activeSection} />
          </div>
          <Badge variant={data.status_detail?.code === 'ACTIVE' ? 'success' : 'warning'} size="sm" dot>
            {data.status_detail?.name ?? 'Unknown'}
          </Badge>
        </div>

        {/* All sections */}
        <ProfileSection data={data} />
        <PersonalSection data={data} />
        <EmploymentSection data={data} />
        <AddressSection data={data} />
        <FamilySection data={data} />
        <EducationSection data={data} />
        <BankSection data={data} />
        <NomineeSection data={data} />
        <LanguageSection data={data} />
        <SystemSection data={data} />
      </div>
    </div>
  );
}
