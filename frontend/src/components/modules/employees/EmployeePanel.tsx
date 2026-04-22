import { FileLock2, UserPlus, UserRound, UsersRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DataTable, Tabs } from '@components/ui';
import { useAuthStore } from '@store/authStore';
import { useUIStore } from '@store/uiStore';
import type { ColumnDef, FilterChip } from '@components/ui';
import { EmployeeDocumentsTab } from './EmployeeDocumentsTab';
import { EmployeeLifecycleTab } from './EmployeeLifecycleTab';
import { EmployeeOverview } from './EmployeeOverview';
import { EmployeeProfileTab } from './EmployeeProfileTab';
import { AddEmployeeForm } from './AddEmployeeForm';
import { useEmployeeList } from '@hooks/useEmployees';
import type { EmployeeListItem } from '@hooks/useEmployees';

const teamFilters: FilterChip[] = [
  { id: 'department', label: 'Department', value: 'Experience Design' },
  { id: 'location', label: 'Location', value: 'Pune' }
];

/* ------------------------------------------------------------------ */
/*  Admin: Employee Directory                                          */
/* ------------------------------------------------------------------ */

function EmployeeDirectory() {
  const [showAddForm, setShowAddForm] = useState(false);
  const { data: apiEmployees = [], isLoading } = useEmployeeList();

  const columns = useMemo<ColumnDef<EmployeeListItem>[]>(
    () => [
      {
        id: 'full_name',
        header: 'Employee',
        accessor: 'full_name',
        sortable: true,
        width: 240,
        sticky: true,
        render: (row: EmployeeListItem) => (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
              {row.first_name[0]}{row.last_name[0]}
            </div>
            <div>
              <p className="font-medium text-surface-900 dark:text-white">{row.full_name}</p>
              <p className="text-2xs text-surface-500 dark:text-white/40">{row.work_email}</p>
            </div>
          </div>
        ),
      },
      { id: 'employee_code', header: 'Code', accessor: 'employee_code', sortable: true, width: 120 },
      { id: 'designation', header: 'Designation', accessor: 'designation', sortable: true, width: 200 },
      { id: 'department', header: 'Department', accessor: 'department', sortable: true, width: 180 },
      {
        id: 'status',
        header: 'Status',
        accessor: (row) => row.status_detail?.name ?? '—',
        sortable: true,
        width: 120,
        render: (row: EmployeeListItem) => {
          const color = row.status_detail?.color_code;
          return (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color || '#999' }} />
              {row.status_detail?.name ?? '—'}
            </span>
          );
        },
      },
      {
        id: 'date_of_joining',
        header: 'Joined',
        accessor: (row) => row.date_of_joining ?? '—',
        sortable: true,
        width: 120,
        render: (row: EmployeeListItem) =>
          row.date_of_joining
            ? new Date(row.date_of_joining).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            : '—',
      },
    ],
    [],
  );

  if (showAddForm) {
    return <AddEmployeeForm onClose={() => setShowAddForm(false)} onSuccess={() => {}} />;
  }

  return (
    <div className="space-y-4 p-4">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-surface-700 dark:text-white/80">
            Employee Directory
          </h2>
          <p className="text-xs text-surface-500 dark:text-white/40">
            {apiEmployees.length} employee{apiEmployees.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
        >
          <UserPlus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-surface-200 dark:bg-white/10" />
          ))}
        </div>
      ) : apiEmployees.length > 0 ? (
        <DataTable
          id="employee-directory-table"
          data={apiEmployees}
          columns={columns}
          getRowId={(row) => row.id}
          emptyState={
            <div className="p-10 text-center text-sm text-surface-600 dark:text-white/55">
              <FileLock2 className="mx-auto mb-3 h-8 w-8" />
              No employees found.
            </div>
          }
        />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-200 py-16 text-center dark:border-white/10">
          <UserPlus className="h-10 w-10 text-surface-300 dark:text-white/20" />
          <p className="mt-3 text-sm font-medium text-surface-600 dark:text-white/50">No employees yet</p>
          <p className="mt-1 text-xs text-surface-400 dark:text-white/30">Click "Add Employee" to invite your first team member.</p>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="mt-4 flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            <UserPlus className="h-4 w-4" /> Add Employee
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main: Employee Panel                                               */
/* ------------------------------------------------------------------ */

export function EmployeePanel() {
  const employees = useAuthStore((state) => state.employees);
  const employee = employees[0];
  const activeModule = useUIStore((state) => state.activeModule);
  const portal = useUIStore((state) => state.portal);
  const rawModuleView = useUIStore((state) => state.moduleViews[activeModule] ?? 'admin');
  const moduleView = portal === 'ess' ? 'employee' : rawModuleView;

  // Admin view — show directory + add employee
  if (moduleView === 'admin') {
    const items = [
      { label: 'Employee Directory', value: 'directory', content: <EmployeeDirectory /> },
      { label: 'Overview', value: 'overview', content: <EmployeeOverview employee={employee} /> },
      { label: 'Personal', value: 'personal', content: <EmployeeProfileTab employee={employee} sections={employee.personalSections} title="Personal details" /> },
      { label: 'Official', value: 'official', content: <EmployeeProfileTab employee={employee} sections={employee.officialSections} title="Official information" /> },
      { label: 'Documents', value: 'documents', content: <EmployeeDocumentsTab employee={employee} /> },
      { label: 'Lifecycle', value: 'lifecycle', content: <EmployeeLifecycleTab employee={employee} /> },
    ];
    return <Tabs items={items} />;
  }

  // Employee view — existing profile tabs
  const teamColumns = useMemo<ColumnDef<(typeof employees)[number]>[]>(
    () => [
      { id: 'name', header: 'Employee', accessor: 'name', sortable: true, width: 220, sticky: true },
      { id: 'code', header: 'Code', accessor: 'code', sortable: true, width: 140 },
      { id: 'designation', header: 'Designation', accessor: 'designation', sortable: true, width: 220 },
      { id: 'department', header: 'Department', accessor: 'department', sortable: true, width: 180 },
      { id: 'status', header: 'Status', accessor: 'status', sortable: true, width: 140 },
      { id: 'location', header: 'Location', accessor: 'location', sortable: true, width: 140 }
    ],
    [employees]
  );

  const items = [
    { label: 'Overview', value: 'overview', content: <EmployeeOverview employee={employee} /> },
    { label: 'Personal', value: 'personal', content: <EmployeeProfileTab employee={employee} sections={employee.personalSections} title="Personal details" /> },
    { label: 'Official', value: 'official', content: <EmployeeProfileTab employee={employee} sections={employee.officialSections} title="Official information" /> },
    { label: 'Documents', value: 'documents', content: <EmployeeDocumentsTab employee={employee} /> },
    { label: 'Lifecycle', value: 'lifecycle', content: <EmployeeLifecycleTab employee={employee} /> },
    {
      label: 'Team',
      value: 'team',
      content: (
        <DataTable
          id="employee-team-table"
          data={employees}
          columns={teamColumns}
          getRowId={(row) => row.id}
          activeFilters={teamFilters}
          bulkActions={[
            { label: 'Export selected', onClick: () => undefined, variant: 'secondary' },
            { label: 'Archive', onClick: () => undefined, variant: 'danger' }
          ]}
          rowActions={() => (
            <>
              <button type="button" className="btn-ghost h-8 px-2" aria-label="Edit employee"><UserRound className="h-3.5 w-3.5" /></button>
              <button type="button" className="btn-ghost h-8 px-2" aria-label="View reports"><UsersRound className="h-3.5 w-3.5" /></button>
            </>
          )}
          emptyState={<div className="p-10 text-center text-sm text-surface-600 dark:text-white/55"><FileLock2 className="mx-auto mb-3 h-8 w-8" />No team members match the current filters.</div>}
        />
      )
    }
  ];

  return <Tabs items={items} />;
}
