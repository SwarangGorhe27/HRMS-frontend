import { motion, useMotionValue } from 'framer-motion';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useDockStore } from '@store/dockStore';
import { useAuthStore } from '@store/authStore';
import { useUIStore, ESS_MODULES } from '@store/uiStore';
import { usePermissions } from '@hooks/usePermissions';
import { DockMotionContext } from './DockContext';
import { DockIcon } from './DockIcon';

export function DockBar() {
  const mouseX = useMotionValue(-1000);
  const modules = useDockStore((state) => state.modules);
  const activeModule = useUIStore((state) => state.activeModule);
  const userPermissions = useAuthStore((state) => state.user.permissions);
  const portal = useUIStore((state) => state.portal);
  const { can } = usePermissions();
  const [scrolled, setScrolled] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setIsScrolling(true);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => setIsScrolling(false), 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  const visibleModules = useMemo(() => {
    const portalFiltered = portal === 'ess'
      ? modules.filter((m) => ESS_MODULES.includes(m.key))
      : modules;
    return portalFiltered.filter(
      (module) => module.locked || can('view', module.key) || userPermissions.includes(module.permission),
    );
  }, [can, modules, userPermissions, portal]);

  return (
    <DockMotionContext.Provider value={{ mouseX }}>
      <motion.div
        className="fixed inset-x-0 bottom-4 z-50 flex justify-center"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 24 }}
      >
        <motion.div
          onMouseMove={(event) => mouseX.set(event.clientX)}
          onMouseLeave={() => mouseX.set(-1000)}
          animate={{
            filter: isScrolling ? 'blur(3px) saturate(0.6)' : 'blur(0px) saturate(1)',
            opacity: isScrolling ? 0.55 : 1,
          }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`flex items-end gap-2 overflow-visible transition-[background,box-shadow,border,padding,border-radius] duration-300 ${
            scrolled
              ? 'rounded-2xl px-4 py-2.5 bg-white/75 shadow-xl shadow-black/10 ring-1 ring-surface-200/60 backdrop-blur-2xl dark:bg-surface-900/75 dark:ring-white/10 dark:shadow-black/30'
              : 'py-2.5'
          }`}
        >
          {visibleModules.map((module) => (
            <DockIcon key={module.key} module={module} active={activeModule === module.key} />
          ))}
        </motion.div>
      </motion.div>
    </DockMotionContext.Provider>
  );
}
