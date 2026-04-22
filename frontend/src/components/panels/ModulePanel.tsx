import { motion } from 'framer-motion';
import { Home, X } from 'lucide-react';
import { useMemo } from 'react';
import { useAuthStore } from '@store/authStore';
import { useDockStore } from '@store/dockStore';
import { useUIStore } from '@store/uiStore';
import { Button, Tabs } from '@components/ui';
import { EmployeePanel } from '@components/modules/employees/EmployeePanel';
import { AttendancePanel } from '@components/modules/attendance/AttendancePanel';
import { LeavePanel } from '@components/modules/leave/LeavePanel';
import { CanteenPanel } from '@components/modules/canteen/CanteenPanel';
import { PayrollPanel } from '@components/modules/payroll/PayrollPanel';
import { DocumentPanel } from '@components/modules/documents/DocumentPanel';
import { SettingsPanel } from '@components/modules/settings/SettingsPanel';
import { AIPanel } from '@components/modules/ai/AIPanel';
import { FormsPanel } from '@components/modules/forms/FormsPanel';
import { BiometricPanel } from '@components/modules/biometric/BiometricPanel';
import { LifecyclePanel } from '@components/modules/lifecycle/LifecyclePanel';

function PlaceholderModule({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-100 dark:bg-white/5">
        <Home className="h-7 w-7 text-surface-400 dark:text-white/30" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-surface-900 dark:text-white">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-surface-500 dark:text-white/45">{description}</p>
      <p className="mt-1 text-xs text-surface-400 dark:text-white/30">This module will be available soon.</p>
    </div>
  );
}

export function ModulePanel() {
  const activeModule = useUIStore((state) => state.activeModule);
  const closeModule = useUIStore((state) => state.closeModule);
  const moduleViews = useUIStore((state) => state.moduleViews);
  const setModuleView = useUIStore((state) => state.setModuleView);
  const role = useAuthStore((state) => state.user.role);
  const portal = useUIStore((state) => state.portal);
  const modules = useDockStore((state) => state.modules);
  const active = modules.find((module) => module.key === activeModule);

  const tabItems = useMemo(() => {
    switch (activeModule) {
      case 'employees':
        return [{ label: 'Employee Workspace', value: 'employees', content: <EmployeePanel /> }];
      case 'attendance':
        return [{ label: 'Attendance', value: 'attendance', content: <AttendancePanel /> }];
      case 'leave':
        return [{ label: 'Leave Management', value: 'leave', content: <LeavePanel /> }];
      case 'canteen':
        return [{ label: 'Canteen', value: 'canteen', content: <CanteenPanel /> }];
      case 'payroll':
        return [{ label: 'Payroll', value: 'payroll', content: <PayrollPanel /> }];
      case 'documents':
        return [{ label: 'Documents', value: 'documents', content: <DocumentPanel /> }];
      case 'settings':
        return [{ label: 'Settings', value: 'settings', content: <SettingsPanel /> }];
      case 'ai':
        return [{ label: 'AI Assistant', value: 'ai', content: <AIPanel /> }];
      case 'forms':
        return [{ label: 'Forms', value: 'forms', content: <FormsPanel /> }];
      case 'biometric':
        return [{ label: 'Biometric', value: 'biometric', content: <BiometricPanel /> }];
      case 'lifecycle':
        return [{ label: 'Lifecycle', value: 'lifecycle', content: <LifecyclePanel /> }];
      default:
        return [{ label: 'Overview', value: 'overview', content: <PlaceholderModule title={active?.label ?? 'Module'} description="Configure and manage this module from the admin panel." /> }];
    }
  }, [active?.label, activeModule]);

  return (
    <motion.div
      key={activeModule}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* Module header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md ${active?.colorClass ?? 'from-brand-500 to-brand-600'}`}>
            {active ? <active.icon className="h-5 w-5" /> : null}
          </span>
          <div>
            <h1 className="text-xl font-semibold text-surface-900 dark:text-white">{active?.label}</h1>
            <p className="text-xs text-surface-500 dark:text-white/40">
              <button type="button" onClick={closeModule} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Dashboard
              </button>
              {' / '}{active?.label}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {role === 'ADMIN' && portal === 'hrms' ? (
            <div className="flex items-center rounded-xl border border-surface-300/70 bg-surface-100 p-1 text-xs dark:border-white/10 dark:bg-white/5">
              {(['employee', 'admin'] as const).map((view) => (
                <button
                  key={view}
                  type="button"
                  className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${moduleViews[activeModule] === view ? 'bg-surface-0 text-surface-900 shadow-sm dark:bg-white/10 dark:text-white' : 'text-surface-600 hover:text-surface-800 dark:text-white/50 dark:hover:text-white/70'}`}
                  onClick={() => setModuleView(activeModule, view)}
                >
                  {view === 'employee' ? 'Employee' : 'Admin'}
                </button>
              ))}
            </div>
          ) : null}
          <Button variant="secondary" size="sm" iconLeft={<Home className="h-3.5 w-3.5" />} onClick={closeModule}>
            Dashboard
          </Button>
          <Button variant="ghost" size="sm" iconOnly aria-label="Close module" onClick={closeModule}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Module content */}
      <div className="surface-card rounded-2xl">
        <Tabs items={tabItems} className="flex flex-col" />
      </div>
    </motion.div>
  );
}
