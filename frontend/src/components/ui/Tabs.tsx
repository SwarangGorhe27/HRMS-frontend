import * as RadixTabs from '@radix-ui/react-tabs';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { cn } from '@utils/utils';

export interface TabItem {
  label: string;
  value: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  variant?: 'underline' | 'pills' | 'boxed';
  className?: string;
}

const listVariants = {
  underline: 'border-b border-surface-300/80 dark:border-white/10',
  pills: 'rounded-xl bg-surface-100 p-1 dark:bg-white/5',
  boxed: 'rounded-xl border border-surface-300/70 p-1 dark:border-white/10'
} as const;

const triggerVariants = {
  underline: 'relative rounded-none px-1 pb-3 pt-1 text-sm text-surface-600 data-[state=active]:text-surface-900 dark:text-white/55 dark:data-[state=active]:text-white',
  pills: 'relative rounded-lg px-3 py-2 text-sm text-surface-600 data-[state=active]:text-surface-900 dark:text-white/55 dark:data-[state=active]:text-white',
  boxed: 'relative rounded-lg px-3 py-2 text-sm text-surface-600 data-[state=active]:text-surface-900 dark:text-white/55 dark:data-[state=active]:text-white'
} as const;

export function Tabs({ items, defaultValue, value: controlledValue, onChange, variant = 'underline', className }: TabsProps) {
  const initialValue = defaultValue ?? items[0]?.value;
  const [internalValue, setInternalValue] = useState(initialValue);
  const value = controlledValue ?? internalValue;
  const [mounted, setMounted] = useState<string[]>(initialValue ? [initialValue] : []);

  return (
    <RadixTabs.Root
      value={value}
      onValueChange={(nextValue) => {
        setInternalValue(nextValue);
        onChange?.(nextValue);
        setMounted((current) => (current.includes(nextValue) ? current : [...current, nextValue]));
      }}
      className={className}
    >
      <RadixTabs.List className={cn('flex gap-3', listVariants[variant])}>
        {items.map((item) => (
          <RadixTabs.Trigger key={item.value} value={item.value} className={cn('relative font-medium outline-none', triggerVariants[variant])}>
            {value === item.value ? (
              <motion.span
                layoutId={`tab-indicator-${variant}`}
                className={cn(
                  'absolute inset-x-0 rounded-full bg-brand-500/10',
                  variant === 'underline' ? '-bottom-px h-0.5 bg-brand-500' : 'inset-0'
                )}
              />
            ) : null}
            <span className="relative z-10">{item.label}</span>
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
        <RadixTabs.Content key={item.value} value={item.value} className="pt-4 outline-none">
          <AnimatePresence mode="wait">
            {mounted.includes(item.value) && value === item.value ? (
              <motion.div key={item.value} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                {item.content}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
