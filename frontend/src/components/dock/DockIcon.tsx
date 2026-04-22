import { AnimatePresence, motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useRef, useState } from 'react';
import React from 'react';
import { Tooltip } from '@components/ui/Tooltip';
import { useUIStore } from '@store/uiStore';
import type { DockModule } from '@store/dockStore';
import { cn } from '@utils/utils';
import { useDockMotionContext } from './DockContext';
import { useMagnification } from './useMagnification';

interface DockIconProps {
  module: DockModule;
  active: boolean;
}

export function DockIcon({ module, active }: DockIconProps) {
  const openModule = useUIStore((state) => state.openModule);
  const { mouseX } = useDockMotionContext();
  const ref = useRef<HTMLButtonElement>(null);
  const { scale, y } = useMagnification(ref, mouseX);
  const [hovered, setHovered] = useState(false);
  const Icon = module.icon as React.ComponentType<{ className?: string }>;

  function handleClick() {
    if (module.locked) return;
    openModule(module.key);
  }

  return (
    <Tooltip content={module.locked ? 'Upgrade plan' : module.label} delayDuration={600}>
      <button
        ref={ref}
        type="button"
        className="relative flex min-w-[64px] flex-col items-center justify-end gap-1.5 pb-1 outline-none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
      >
        <motion.div style={{ scale, y }} whileTap={{ scale: 0.97 }} className="relative">
          <div className={cn('relative flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md transition-all', module.colorClass, hovered && module.glowClass, module.locked && 'grayscale')}>
            <Icon className="h-[22px] w-[22px]" />
            {module.locked ? <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-surface-900/20"><Lock className="h-4 w-4" /></span> : null}
          </div>
        </motion.div>
        <AnimatePresence>
          {hovered ? (
            <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="text-[10px] font-semibold text-surface-600 dark:text-white/55">
              {module.label}
            </motion.span>
          ) : (
            <span className="h-[14px]" aria-hidden="true" />
          )}
        </AnimatePresence>
        {active ? <span className="h-1 w-1 rounded-full bg-brand-400 shadow-glow-brand animate-pulse-dot" /> : <span className="h-1 w-1" aria-hidden="true" />}
      </button>
    </Tooltip>
  );
}
