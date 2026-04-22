import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Cake,
  CalendarClock,
  Clock3,
  MapPin,
  TrendingUp,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';
import { useDashboard } from '@hooks/useDashboard';
import { Avatar } from '@components/ui/Avatar';
import { Badge } from '@components/ui/Badge';
import { cn } from '@utils/utils';

/* ------------------------------------------------------------------ */
/*  Stat Card                                                          */
/* ------------------------------------------------------------------ */
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  color: string;
}

function StatCard({ label, value, icon, trend, color }: StatCardProps) {
  return (
    <article className="surface-card flex items-start gap-4 rounded-2xl px-5 py-5">
      <div
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
          color
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-surface-500 dark:text-white/50">{label}</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-surface-900 dark:text-white">
          {value}
        </p>
        {trend && (
          <p
            className={cn(
              'mt-1 flex items-center gap-1 text-xs font-medium',
              trend.positive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-500 dark:text-red-400'
            )}
          >
            {trend.positive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {trend.value}
          </p>
        )}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton loader for cards                                          */
/* ------------------------------------------------------------------ */
function CardSkeleton() {
  return (
    <div className="surface-card animate-pulse rounded-2xl px-5 py-5">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 rounded-xl bg-surface-200 dark:bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 rounded bg-surface-200 dark:bg-white/10" />
          <div className="h-6 w-16 rounded bg-surface-200 dark:bg-white/10" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Department pill                                                    */
/* ------------------------------------------------------------------ */
const deptColors: Record<string, string> = {
  Engineering: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
  Product: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300',
  'Experience Design': 'bg-pink-50 text-pink-700 dark:bg-pink-500/10 dark:text-pink-300',
  'People Operations': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  Finance: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  DevOps: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300',
  'Quality Assurance': 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300',
  Sales: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
};

/* ------------------------------------------------------------------ */
/*  Status badge variant                                               */
/* ------------------------------------------------------------------ */
function statusVariant(status: string): 'success' | 'warning' | 'danger' | 'neutral' {
  switch (status) {
    case 'Active':
      return 'success';
    case 'On Leave':
      return 'warning';
    case 'On Notice':
    case 'Terminated':
      return 'danger';
    default:
      return 'neutral';
  }
}

/* ------------------------------------------------------------------ */
/*  Main Dashboard                                                     */
/* ------------------------------------------------------------------ */
export function Dashboard() {
  const { data, isLoading, isError } = useDashboard();

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Activity className="h-10 w-10 text-surface-400 dark:text-white/30" />
        <p className="mt-3 text-sm text-surface-600 dark:text-white/50">
          Unable to load dashboard data.
        </p>
        <p className="text-xs text-surface-400 dark:text-white/30">
          Make sure the backend server is running.
        </p>
      </div>
    );
  }

  const emp = data?.employees;
  const att = data?.attendance;
  const trendValues = att?.daily_trend?.map((d) => d.present) ?? [];
  const trendMax = Math.max(...trendValues, 1);

  return (
    <div className="space-y-6">
      {/* ── Welcome header ─────────────────────────────────── */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-surface-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-surface-500 dark:text-white/45">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Badge variant="brand" size="sm">
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </Badge>
      </div>

      {/* ── Stat cards row ─────────────────────────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Total Employees"
              value={emp?.total ?? 0}
              icon={<Users className="h-5 w-5 text-brand-600 dark:text-brand-300" />}
              color="bg-brand-50 dark:bg-brand-500/10"
              trend={{ value: `${emp?.active ?? 0} active`, positive: true }}
            />
            <StatCard
              label="Present Today"
              value={att?.present_today ?? 0}
              icon={<UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />}
              color="bg-emerald-50 dark:bg-emerald-500/10"
              trend={
                att && att.absent_today > 0
                  ? { value: `${att.absent_today} absent`, positive: false }
                  : undefined
              }
            />
            <StatCard
              label="Attendance Rate"
              value={`${att?.attendance_rate ?? 0}%`}
              icon={<TrendingUp className="h-5 w-5 text-sky-600 dark:text-sky-300" />}
              color="bg-sky-50 dark:bg-sky-500/10"
              trend={{ value: 'This month', positive: (att?.attendance_rate ?? 0) >= 90 }}
            />
            <StatCard
              label="On Leave"
              value={emp?.on_leave ?? 0}
              icon={<UserMinus className="h-5 w-5 text-amber-600 dark:text-amber-300" />}
              color="bg-amber-50 dark:bg-amber-500/10"
              trend={
                data?.leave.pending_approvals
                  ? {
                      value: `${data.leave.pending_approvals} pending`,
                      positive: false,
                    }
                  : undefined
              }
            />
          </>
        )}
      </section>

      {/* ── Charts + Department row ───────────────────────── */}
      <section className="grid gap-4 lg:grid-cols-5">
        {/* Attendance trend */}
        <div className="surface-card col-span-3 rounded-2xl px-5 py-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
                Attendance Trend
              </h2>
              <p className="text-xs text-surface-500 dark:text-white/40">
                April 2026 — daily present count
              </p>
            </div>
            <CalendarClock className="h-4 w-4 text-surface-400 dark:text-white/30" />
          </div>
          {isLoading ? (
            <div className="h-12 animate-pulse rounded bg-surface-100 dark:bg-white/5" />
          ) : (
            <div className="flex items-end gap-[5px]" style={{ height: 80 }}>
              {trendValues.map((value, i) => {
                const pct = trendMax > 0 ? (value / trendMax) * 100 : 0;
                const dateLabel = att?.daily_trend?.[i]?.date ?? '';
                const day = dateLabel ? new Date(dateLabel).getDate() : '';
                return (
                  <div key={i} className="group relative flex flex-1 flex-col items-center">
                    <div className="absolute -top-6 hidden rounded bg-surface-900 px-1.5 py-0.5 text-2xs text-white group-hover:block dark:bg-white dark:text-surface-900">
                      {value}
                    </div>
                    <div
                      className="w-full max-w-[14px] rounded-sm bg-brand-500/80 transition-all hover:bg-brand-600 dark:bg-brand-400/70 dark:hover:bg-brand-400"
                      style={{ height: `${Math.max(pct, 6)}%` }}
                    />
                    {i % 2 === 0 && (
                      <span className="mt-1 text-2xs text-surface-400 dark:text-white/30">
                        {day}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Department breakdown */}
        <div className="surface-card col-span-2 rounded-2xl px-5 py-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
              Departments
            </h2>
            <span className="text-xs text-surface-400 dark:text-white/30">
              {data?.departments?.length ?? 0} teams
            </span>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 animate-pulse rounded bg-surface-100 dark:bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {data?.departments?.map((dept) => {
                const total = emp?.total ?? 1;
                const pct = Math.round((dept.count / total) * 100);
                const colorClass =
                  deptColors[dept.name] ??
                  'bg-surface-100 text-surface-700 dark:bg-white/5 dark:text-white/70';
                return (
                  <div key={dept.name}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', colorClass)}>
                        {dept.name}
                      </span>
                      <span className="text-xs tabular-nums text-surface-500 dark:text-white/45">
                        {dept.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-100 dark:bg-white/5">
                      <div
                        className="h-full rounded-full bg-brand-500 transition-all dark:bg-brand-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Recent employees + Birthdays row ──────────────── */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* Recent employees */}
        <div className="surface-card col-span-2 rounded-2xl px-5 py-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
              Recent Employees
            </h2>
            <UserPlus className="h-4 w-4 text-surface-400 dark:text-white/30" />
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-9 w-9 animate-pulse rounded-full bg-surface-200 dark:bg-white/10" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-32 animate-pulse rounded bg-surface-200 dark:bg-white/10" />
                    <div className="h-2.5 w-48 animate-pulse rounded bg-surface-200 dark:bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-surface-100 dark:divide-white/5">
              {data?.recent_employees?.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <Avatar name={emp.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-surface-900 dark:text-white">
                        {emp.name}
                      </p>
                      <span className="text-2xs text-surface-400 dark:text-white/30">
                        {emp.code}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-white/45">
                      <span className="truncate">{emp.designation}</span>
                      {emp.department && (
                        <>
                          <span className="text-surface-300 dark:text-white/15">·</span>
                          <span className="truncate">{emp.department}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {emp.location && (
                      <span className="hidden items-center gap-1 text-xs text-surface-400 dark:text-white/35 sm:flex">
                        <MapPin className="h-3 w-3" />
                        {emp.location.replace(' Office', '')}
                      </span>
                    )}
                    <Badge variant={statusVariant(emp.status)} size="sm">
                      {emp.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {(!data?.recent_employees || data.recent_employees.length === 0) && (
                <p className="py-6 text-center text-sm text-surface-400 dark:text-white/30">
                  No employees found.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Upcoming birthdays + Quick stats */}
        <div className="flex flex-col gap-4">
          {/* Birthdays */}
          <div className="surface-card flex-1 rounded-2xl px-5 py-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
                Upcoming Birthdays
              </h2>
              <Cake className="h-4 w-4 text-surface-400 dark:text-white/30" />
            </div>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-8 animate-pulse rounded bg-surface-100 dark:bg-white/5" />
                ))}
              </div>
            ) : data?.upcoming_birthdays && data.upcoming_birthdays.length > 0 ? (
              <div className="space-y-3">
                {data.upcoming_birthdays.map((b) => (
                  <div key={b.code} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 dark:bg-pink-500/10">
                      <Cake className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-surface-900 dark:text-white">
                        {b.name}
                      </p>
                      <p className="text-xs text-surface-500 dark:text-white/45">
                        {new Date(b.date).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-xs text-surface-400 dark:text-white/30">
                No upcoming birthdays
              </p>
            )}
          </div>

          {/* Quick info */}
          <div className="surface-card rounded-2xl px-5 py-5">
            <h2 className="mb-3 text-sm font-semibold text-surface-900 dark:text-white">
              Quick Info
            </h2>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs text-surface-500 dark:text-white/45">
                  <Clock3 className="h-3.5 w-3.5" /> Late arrivals today
                </span>
                <span className="text-sm font-semibold tabular-nums text-surface-900 dark:text-white">
                  {att?.late_today ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs text-surface-500 dark:text-white/45">
                  <UserPlus className="h-3.5 w-3.5" /> New hires this month
                </span>
                <span className="text-sm font-semibold tabular-nums text-surface-900 dark:text-white">
                  {emp?.new_hires_this_month ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs text-surface-500 dark:text-white/45">
                  <Activity className="h-3.5 w-3.5" /> Pending leave requests
                </span>
                <span className="text-sm font-semibold tabular-nums text-surface-900 dark:text-white">
                  {data?.leave?.pending_approvals ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
