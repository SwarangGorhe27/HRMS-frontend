import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Bell, Bot, ChevronDown, Command, MoonStar, Search, SunMedium } from 'lucide-react';
import { Avatar, Badge, Button } from '@components/ui';
import { useUIStore } from '@store/uiStore';
import { useAuthStore } from '@store/authStore';
import { useTheme } from '@hooks/useTheme';
import { cn } from '@utils/utils';

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const setCommandPaletteOpen = useUIStore((state) => state.setCommandPaletteOpen);
  const user = useAuthStore((state) => state.user);
  const portal = useUIStore((state) => state.portal);
  const setPortal = useUIStore((state) => state.setPortal);

  const isDark = theme === 'dark';
  const isEss = portal === 'ess';

  return (
    <header className="glass sticky top-0 z-40 border-b border-surface-300/60">
      <div className="mx-auto flex h-[52px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo + Portal Switcher */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => useUIStore.getState().navigateTo('dashboard')}
            className="flex items-center gap-3"
          >
            <div className={cn(
              'flex h-9 w-9 items-center justify-center rounded-2xl text-sm font-semibold text-white shadow-glow-brand transition-all',
              isEss
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-700'
                : 'bg-gradient-to-br from-brand-500 to-brand-700',
            )}>
              {isEss ? 'E' : 'HR'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-surface-900 dark:text-white">
                {isEss ? 'Employee Portal' : 'HRMS'}
              </p>
              <p className="text-2xs uppercase tracking-[0.16em] text-surface-500 dark:text-white/35">Ampcus Tech</p>
            </div>
          </button>

          {/* Portal Switcher */}
          <div className="flex items-center gap-0.5 rounded-xl border border-surface-200/80 bg-surface-50 p-0.5 dark:border-white/10 dark:bg-white/5">
            {(['hrms', 'ess'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPortal(p)}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-all',
                  portal === p
                    ? p === 'ess'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-brand-600 text-white shadow-sm'
                    : 'text-surface-500 hover:text-surface-800 dark:text-white/40 dark:hover:text-white/70',
                )}
              >
                {p === 'ess' ? 'ESS' : 'HRMS'}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden h-10 w-full max-w-[380px] items-center gap-3 rounded-2xl border border-surface-300/70 bg-surface-0 px-3 text-left text-sm text-surface-500 shadow-xs transition hover:border-surface-400 dark:border-white/10 dark:bg-white/5 dark:text-white/35 md:flex"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1">
            {isEss ? 'Search leave, payslips, documents…' : 'Search employees, actions, modules…'}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg border border-surface-300 px-2 py-1 text-2xs dark:border-white/10"><Command className="h-3 w-3" />K</span>
        </button>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" iconLeft={<Bot className="h-4 w-4" />} onClick={() => useUIStore.getState().setAiAssistantOpen(true)}>AI Assistant</Button>
          <Button variant="ghost" size="sm" iconOnly aria-label="Notifications">
            <div className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-danger-500" />
            </div>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
          >
            {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </Button>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button type="button" className="flex items-center gap-2 rounded-2xl border border-surface-300/70 bg-surface-0 px-2.5 py-1.5 outline-none transition hover:border-surface-400 dark:border-white/10 dark:bg-white/5">
                <Avatar name={user.name} src={user.avatar} size="md" />
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium text-surface-900 dark:text-white">{user.name}</p>
                  <p className="text-2xs text-surface-500 dark:text-white/35">{user.title}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-surface-500 dark:text-white/35" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="end" sideOffset={10} className="z-50 min-w-[220px] rounded-2xl border border-surface-300 bg-surface-0 p-1.5 shadow-lg dark:border-white/10 dark:bg-[var(--surface-100)]">
                <DropdownMenu.Item
                  className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-surface-700 outline-none focus:bg-surface-100 dark:text-white/75 dark:focus:bg-white/5"
                  onSelect={() => useUIStore.getState().navigateTo('my-profile')}
                >
                  My Profile
                </DropdownMenu.Item>
                {['Change Password', 'Preferences', 'Switch Company', 'Sign Out'].map((item) => (
                  <DropdownMenu.Item key={item} className="cursor-pointer rounded-xl px-3 py-2 text-sm text-surface-700 outline-none focus:bg-surface-100 dark:text-white/75 dark:focus:bg-white/5">
                    {item}
                  </DropdownMenu.Item>
                ))}
                <div className="px-3 pb-2 pt-1">
                  <Badge variant="brand">{user.company}</Badge>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
}
