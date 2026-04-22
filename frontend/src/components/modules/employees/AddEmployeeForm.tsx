import { useState } from 'react';
import { CheckCircle2, Copy, Link2, Send, UserPlus, X } from 'lucide-react';
import {
  useDepartments,
  useDesignations,
  useGenders,
  useEmploymentTypes,
  useInviteEmployee,
} from '@hooks/useEmployees';

interface AddEmployeeFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddEmployeeForm({ onClose, onSuccess }: AddEmployeeFormProps) {
  const { data: departments = [] } = useDepartments();
  const { data: designations = [] } = useDesignations();
  const { data: genders = [] } = useGenders();
  const { data: employmentTypes = [] } = useEmploymentTypes();
  const invite = useInviteEmployee();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    work_email: '',
    personal_mobile: '',
    gender: '',
    department: '',
    designation: '',
    employment_type: '',
    date_of_joining: '',
  });

  const [inviteResult, setInviteResult] = useState<{
    employee_code: string;
    full_name: string;
    invite_link: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    invite.mutate(form, {
      onSuccess: (data) => {
        setInviteResult({
          employee_code: data.employee_code,
          full_name: data.full_name,
          invite_link: `${window.location.origin}${data.invite_link}`,
        });
        onSuccess?.();
      },
    });
  };

  const handleCopy = () => {
    if (inviteResult) {
      navigator.clipboard.writeText(inviteResult.invite_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const inputClass = 'w-full rounded-lg border border-surface-200 bg-surface-0 px-3 py-2.5 text-sm text-surface-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-[var(--surface-50)] dark:text-white dark:focus:border-brand-400';
  const labelClass = 'mb-1.5 block text-xs font-medium text-surface-600 dark:text-white/50';

  // Success state — show invite link
  if (inviteResult) {
    return (
      <div className="mx-auto max-w-lg space-y-5 p-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10">
            <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-surface-900 dark:text-white">Employee Created!</h3>
          <p className="mt-1 text-sm text-surface-500 dark:text-white/40">
            <span className="font-medium text-surface-700 dark:text-white/70">{inviteResult.full_name}</span> has been added as{' '}
            <span className="font-mono text-xs font-semibold text-brand-600 dark:text-brand-400">{inviteResult.employee_code}</span>
          </p>
        </div>

        <div className="surface-card rounded-xl border border-surface-100 p-4 dark:border-white/5">
          <p className="mb-2 text-xs font-medium text-surface-600 dark:text-white/50">
            <Link2 className="mr-1 inline h-3 w-3" /> Share this invite link with the employee to set up their password:
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={inviteResult.invite_link}
              className="flex-1 rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-xs font-mono text-surface-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-surface-400 dark:text-white/30">
          The link expires in 7 days. The employee will set their password and log in to complete their profile.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => { setInviteResult(null); setForm({ first_name: '', last_name: '', middle_name: '', work_email: '', personal_mobile: '', gender: '', department: '', designation: '', employment_type: '', date_of_joining: '' }); invite.reset(); }}
            className="flex-1 rounded-xl border border-surface-200 px-4 py-2.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
          >
            <UserPlus className="mr-1.5 inline h-4 w-4" /> Add Another
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold text-surface-900 dark:text-white">
            <UserPlus className="h-5 w-5 text-brand-500" /> Add New Employee
          </h3>
          <p className="mt-0.5 text-xs text-surface-500 dark:text-white/40">
            Enter the initial details. The employee will complete their profile after logging in.
          </p>
        </div>
        <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 dark:text-white/30 dark:hover:bg-white/5">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="surface-card rounded-xl border border-surface-100 p-5 dark:border-white/5">
        {/* Personal */}
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-surface-400 dark:text-white/30">Personal Information</h4>
        <div className="mb-5 grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>First Name *</label>
            <input type="text" value={form.first_name} onChange={(e) => update('first_name', e.target.value)} className={inputClass} required placeholder="e.g. Rahul" />
          </div>
          <div>
            <label className={labelClass}>Middle Name</label>
            <input type="text" value={form.middle_name} onChange={(e) => update('middle_name', e.target.value)} className={inputClass} placeholder="Optional" />
          </div>
          <div>
            <label className={labelClass}>Last Name *</label>
            <input type="text" value={form.last_name} onChange={(e) => update('last_name', e.target.value)} className={inputClass} required placeholder="e.g. Sharma" />
          </div>
        </div>

        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Gender *</label>
            <select value={form.gender} onChange={(e) => update('gender', e.target.value)} className={inputClass} required>
              <option value="">Select gender</option>
              {genders.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
        </div>

        {/* Contact */}
        <h4 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wide text-surface-400 dark:text-white/30">Contact Details</h4>
        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Work Email *</label>
            <input type="email" value={form.work_email} onChange={(e) => update('work_email', e.target.value)} className={inputClass} required placeholder="e.g. rahul@company.com" />
          </div>
          <div>
            <label className={labelClass}>Mobile Number *</label>
            <input type="tel" value={form.personal_mobile} onChange={(e) => update('personal_mobile', e.target.value)} className={inputClass} required placeholder="e.g. +919876543210" />
          </div>
        </div>

        {/* Employment */}
        <h4 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wide text-surface-400 dark:text-white/30">Employment Details</h4>
        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Department *</label>
            <select value={form.department} onChange={(e) => update('department', e.target.value)} className={inputClass} required>
              <option value="">Select department</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Designation *</label>
            <select value={form.designation} onChange={(e) => update('designation', e.target.value)} className={inputClass} required>
              <option value="">Select designation</option>
              {designations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Employment Type</label>
            <select value={form.employment_type} onChange={(e) => update('employment_type', e.target.value)} className={inputClass}>
              <option value="">Full-Time (default)</option>
              {employmentTypes.map((et) => <option key={et.id} value={et.id}>{et.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Date of Joining *</label>
            <input type="date" value={form.date_of_joining} onChange={(e) => update('date_of_joining', e.target.value)} className={inputClass} required />
          </div>
        </div>
      </div>

      {/* Error */}
      {invite.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {(invite.error as Error)?.message || 'Failed to create employee. Please check the details.'}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-surface-200 px-5 py-2.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={invite.isPending}
          className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
        >
          <Send className="h-4 w-4" />
          {invite.isPending ? 'Creating...' : 'Create & Send Invite'}
        </button>
      </div>
    </form>
  );
}
