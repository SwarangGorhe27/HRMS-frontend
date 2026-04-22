import { BrainCircuit, BriefcaseBusiness, CalendarClock, FileBadge2, FileSpreadsheet, Fingerprint, FolderKanban, Settings2, TimerReset, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { create } from 'zustand';
import React from 'react';
import type { ModuleKey } from './uiStore';
import { CanteenIcon } from '@components/icons/CanteenIcon';

export interface DockModule {
  key: ModuleKey;
  label: string;
  icon: LucideIcon | React.ComponentType<{ className?: string; size?: number }>;
  colorClass: string;
  glowClass: string;
  permission: string;
  locked?: boolean;
}

interface DockState {
  modules: DockModule[];
}

export const useDockStore = create<DockState>(() => ({
  modules: [
    { key: 'employees', label: 'Employees', icon: Users, colorClass: 'from-brand-500 to-brand-600', glowClass: 'shadow-glow-brand', permission: 'employees:view' },
    { key: 'attendance', label: 'Attendance', icon: CalendarClock, colorClass: 'from-sky-500 to-sky-600', glowClass: 'shadow-[0_0_20px_rgba(14,165,233,0.35)]', permission: 'attendance:view' },
    { key: 'leave', label: 'Leave', icon: TimerReset, colorClass: 'from-emerald-500 to-emerald-600', glowClass: 'shadow-glow-success', permission: 'leave:view' },
    { key: 'canteen', label: 'Canteen', icon: CanteenIcon, colorClass: 'from-green-500 to-green-600', glowClass: 'shadow-[0_0_20px_rgba(34,197,94,0.35)]', permission: 'canteen:view' },
    { key: 'payroll', label: 'Payroll', icon: FileSpreadsheet, colorClass: 'from-amber-500 to-amber-600', glowClass: 'shadow-glow-warning', permission: 'payroll:view' },
    { key: 'documents', label: 'Documents', icon: FileBadge2, colorClass: 'from-violet-500 to-violet-600', glowClass: 'shadow-[0_0_20px_rgba(139,92,246,0.35)]', permission: 'documents:view' },
    { key: 'forms', label: 'Forms', icon: FolderKanban, colorClass: 'from-pink-500 to-pink-600', glowClass: 'shadow-[0_0_20px_rgba(236,72,153,0.35)]', permission: 'forms:view', locked: true },
    { key: 'ai', label: 'AI', icon: BrainCircuit, colorClass: 'from-cyan-500 to-cyan-600', glowClass: 'shadow-[0_0_20px_rgba(6,182,212,0.35)]', permission: 'ai:view' },
    { key: 'biometric', label: 'Biometric', icon: Fingerprint, colorClass: 'from-red-500 to-red-600', glowClass: 'shadow-glow-danger', permission: 'biometric:view', locked: true },
    { key: 'lifecycle', label: 'Lifecycle', icon: BriefcaseBusiness, colorClass: 'from-orange-500 to-orange-600', glowClass: 'shadow-[0_0_20px_rgba(249,115,22,0.35)]', permission: 'employees:view' },
    { key: 'settings', label: 'Settings', icon: Settings2, colorClass: 'from-slate-500 to-slate-600', glowClass: 'shadow-[0_0_20px_rgba(107,114,128,0.35)]', permission: 'settings:view' }
  ]
}));
