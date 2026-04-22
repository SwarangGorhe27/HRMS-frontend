import {
  CalendarClock,
  CalendarDays,
  ClipboardList,
  FileText,
  Utensils,
  Wallet,
  TrendingDown,
  CheckCircle2,
  ChevronRight,
  Gift,
} from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { useUIStore } from '@store/uiStore';
import { useMyLeaveBalances, useUpcomingHolidays } from '@hooks/useLeave';
import { useMyPayslips } from '@hooks/usePayroll';
import { useMyWallet } from '@hooks/useCanteen';
import { useAttendanceRecords } from '@hooks/useAttendance';
import { cn } from '@utils/utils';
import type { ModuleKey } from '@store/uiStore';

/* ------------------------------------------------------------------ */
/*  Greeting                                                           */
/* ------------------------------------------------------------------ */
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ------------------------------------------------------------------ */
/*  Quick-link card                                                     */
/* ------------------------------------------------------------------ */
interface QuickLinkProps {
  module: ModuleKey;
  label: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
}

function QuickLink({ module, label, sub, icon, color }: QuickLinkProps) {
  const openModule = useUIStore((s) => s.openModule);
  return (
    <button
      type="button"
      onClick={() => openModule(module)}
      className="group flex items-center gap-3 rounded-2xl border border-surface-200/70 bg-surface-0 px-4 py-3.5 text-left shadow-xs transition-all hover:border-surface-300 hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
    >
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white', color)}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-surface-900 dark:text-white">{label}</p>
        <p className="truncate text-xs text-surface-500 dark:text-white/40">{sub}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-surface-400 transition-transform group-hover:translate-x-0.5 dark:text-white/30" />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat tile                                                           */
/* ------------------------------------------------------------------ */
interface StatTileProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;
  note?: string;
}

function StatTile({ label, value, icon, accent, note }: StatTileProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-surface-200/70 bg-surface-0 px-4 py-4 shadow-xs dark:border-white/10 dark:bg-white/5">
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', accent)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-surface-500 dark:text-white/45">{label}</p>
        <p className="mt-0.5 text-xl font-bold tabular-nums text-surface-900 dark:text-white">{value}</p>
        {note && <p className="mt-0.5 text-xs text-surface-400 dark:text-white/30">{note}</p>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main ESS Dashboard                                                  */
/* ------------------------------------------------------------------ */
export function EssDashboard() {
  const user = useAuthStore((s) => s.user);
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  // Data fetching
  const { data: balancesRaw = [] } = useMyLeaveBalances();
  const { data: payslipsRaw = [] } = useMyPayslips();
  const { data: walletRaw } = useMyWallet();
  const { data: attendanceRaw = [] } = useAttendanceRecords(month, year);
  const { data: holidaysRaw = [] } = useUpcomingHolidays();

  // Type casting
  interface LeaveBalance { id: string; leave_type_detail: { name: string; code: string; color_code: string }; available: number; used: number; total_allocated: number }
  interface Payslip { id: string; month: number; year: number; net_pay: string | number; gross_earnings: string | number; total_deductions: string | number; run_name: string }
  interface AttRecord { status: string }
  interface Holiday { id: string; name: string; date: string; is_optional: boolean }
  interface WalletData { balance: string | number }

  const balances = balancesRaw as unknown as LeaveBalance[];
  const payslips = payslipsRaw as unknown as Payslip[];
  const attendance = attendanceRaw as unknown as AttRecord[];
  const holidays = holidaysRaw as unknown as Holiday[];
  const wallet = walletRaw as WalletData | undefined;

  const latestPayslip = payslips[0];
  const walletBalance = Number(wallet?.balance ?? 0);
  const presentDays = attendance.filter((r) => r.status === 'PRESENT').length;
  const absentDays = attendance.filter((r) => r.status === 'ABSENT').length;

  // Upcoming holidays (next 3)
  const upcomingHolidays = holidays
    .filter((h) => new Date(h.date) >= today)
    .slice(0, 3);

  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="mx-auto max-w-5xl space-y-7 px-4 pb-28 pt-6 sm:px-6">
      {/* ── Greeting header ─────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            {greeting()}, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="mt-0.5 text-sm text-surface-500 dark:text-white/45">
            {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="hidden rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-center dark:border-emerald-800/40 dark:bg-emerald-900/20 sm:block">
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Wallet Balance</p>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">₹{walletBalance.toFixed(2)}</p>
        </div>
      </div>

      {/* ── Attendance stats ─────────────────────────────── */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-white/30">
          This Month — Attendance
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile
            label="Present"
            value={presentDays}
            icon={<CheckCircle2 className="h-5 w-5 text-white" />}
            accent="bg-emerald-500"
            note="days this month"
          />
          <StatTile
            label="Absent"
            value={absentDays}
            icon={<TrendingDown className="h-5 w-5 text-white" />}
            accent="bg-red-500"
            note="days this month"
          />
          <StatTile
            label="Working Days"
            value={attendance.length || '—'}
            icon={<CalendarClock className="h-5 w-5 text-white" />}
            accent="bg-sky-500"
            note="recorded"
          />
          <StatTile
            label="Wallet Balance"
            value={`₹${walletBalance.toFixed(0)}`}
            icon={<Wallet className="h-5 w-5 text-white" />}
            accent="bg-green-600"
            note="canteen wallet"
          />
        </div>
      </section>

      {/* ── Leave balances ────────────────────────────────── */}
      {balances.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-white/30">
            Leave Balances
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {balances.slice(0, 6).map((b) => {
              const avail = Number(b.available ?? 0);
              const total = Number(b.total_allocated ?? 0);
              const pct = total > 0 ? (avail / total) * 100 : 0;
              const color = b.leave_type_detail?.color_code ?? '#6366f1';
              return (
                <div
                  key={b.id}
                  className="rounded-2xl border border-surface-200/70 bg-surface-0 px-4 py-3.5 shadow-xs dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-surface-700 dark:text-white/70">
                      {b.leave_type_detail?.name ?? 'Leave'}
                    </p>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {b.leave_type_detail?.code}
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-surface-900 dark:text-white">
                    {avail.toFixed(1)}
                    <span className="ml-1 text-xs font-normal text-surface-400 dark:text-white/30">/{total} days</span>
                  </p>
                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-100 dark:bg-white/10">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Latest payslip + upcoming holidays ───────────── */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Payslip */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-white/30">
            Latest Payslip
          </h2>
          {latestPayslip ? (
            <div className="rounded-2xl border border-surface-200/70 bg-surface-0 p-4 shadow-xs dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">{latestPayslip.run_name}</p>
                  <p className="text-xs text-surface-500 dark:text-white/40">
                    {MONTH_NAMES[(latestPayslip.month ?? 1) - 1]} {latestPayslip.year}
                  </p>
                </div>
                <span className="rounded-xl bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                  Published
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {([
                  { label: 'Gross', val: latestPayslip.gross_earnings, color: 'text-sky-600 dark:text-sky-400' },
                  { label: 'Deductions', val: latestPayslip.total_deductions, color: 'text-red-500 dark:text-red-400' },
                  { label: 'Net Pay', val: latestPayslip.net_pay, color: 'text-emerald-600 dark:text-emerald-400 font-bold' },
                ] as const).map((item) => (
                  <div key={item.label} className="rounded-xl bg-surface-50 py-2 dark:bg-white/5">
                    <p className="text-xs text-surface-400 dark:text-white/30">{item.label}</p>
                    <p className={cn('text-sm font-semibold tabular-nums', item.color)}>
                      ₹{Number(item.val).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => useUIStore.getState().openModule('payroll')}
                className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl border border-surface-200 py-2 text-xs font-medium text-surface-600 transition-colors hover:border-surface-300 hover:bg-surface-50 dark:border-white/10 dark:text-white/50 dark:hover:bg-white/5"
              >
                View All Payslips <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-2xl border border-surface-200/70 bg-surface-0 py-10 text-center shadow-xs dark:border-white/10 dark:bg-white/5">
              <FileText className="h-8 w-8 text-surface-300 dark:text-white/20" />
              <p className="mt-2 text-sm text-surface-500 dark:text-white/40">No payslips yet</p>
            </div>
          )}
        </section>

        {/* Upcoming holidays */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-white/30">
            Upcoming Holidays
          </h2>
          <div className="rounded-2xl border border-surface-200/70 bg-surface-0 shadow-xs dark:border-white/10 dark:bg-white/5">
            {upcomingHolidays.length > 0 ? (
              upcomingHolidays.map((h, i) => {
                const d = new Date(h.date);
                return (
                  <div
                    key={h.id}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3',
                      i !== upcomingHolidays.length - 1 && 'border-b border-surface-100 dark:border-white/5',
                    )}
                  >
                    <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                        {d.getDate()}
                      </span>
                      <span className="text-[9px] font-semibold uppercase text-amber-600 dark:text-amber-500">
                        {MONTH_NAMES[d.getMonth()]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-surface-900 dark:text-white">{h.name}</p>
                      <p className="text-xs text-surface-500 dark:text-white/40">
                        {d.toLocaleDateString('en-IN', { weekday: 'long' })}
                        {h.is_optional && ' · Optional'}
                      </p>
                    </div>
                    <Gift className="h-4 w-4 shrink-0 text-amber-400" />
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center py-10 text-center">
                <CalendarDays className="h-8 w-8 text-surface-300 dark:text-white/20" />
                <p className="mt-2 text-sm text-surface-500 dark:text-white/40">No upcoming holidays</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ── Quick actions ─────────────────────────────────── */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-white/30">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <QuickLink
            module="attendance"
            label="My Attendance"
            sub="View clock-in/out records"
            icon={<CalendarClock className="h-5 w-5" />}
            color="bg-sky-500"
          />
          <QuickLink
            module="leave"
            label="Apply for Leave"
            sub="Submit a leave request"
            icon={<ClipboardList className="h-5 w-5" />}
            color="bg-emerald-500"
          />
          <QuickLink
            module="payroll"
            label="My Payslips"
            sub="Download salary statements"
            icon={<FileText className="h-5 w-5" />}
            color="bg-amber-500"
          />
          <QuickLink
            module="canteen"
            label="Order Food"
            sub="Browse menu & place order"
            icon={<Utensils className="h-5 w-5" />}
            color="bg-green-600"
          />
          <QuickLink
            module="documents"
            label="My Documents"
            sub="View & upload documents"
            icon={<FileText className="h-5 w-5" />}
            color="bg-violet-500"
          />
          <QuickLink
            module="canteen"
            label="Canteen Wallet"
            sub={`Balance: ₹${walletBalance.toFixed(2)}`}
            icon={<Wallet className="h-5 w-5" />}
            color="bg-teal-500"
          />
        </div>
      </section>
    </div>
  );
}
