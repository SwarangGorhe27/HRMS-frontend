import { useLayoutEffect, useState, type RefObject } from 'react';
import { useSpring, useTransform, type MotionValue } from 'framer-motion';

export function useMagnification(ref: RefObject<HTMLElement>, mouseX: MotionValue<number>) {
  const [center, setCenter] = useState(-1000);

  useLayoutEffect(() => {
    function measure() {
      const node = ref.current;
      if (!node) {
        return;
      }
      const rect = node.getBoundingClientRect();
      setCenter(rect.left + rect.width / 2);
    }

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [ref]);

  const rawScale = useTransform(mouseX, [center - 128, center - 64, center, center + 64, center + 128], [1, 1.2, 1.5, 1.2, 1]);
  const scale = useSpring(rawScale, { stiffness: 380, damping: 26, mass: 0.6 });
  const y = useTransform(scale, [1, 1.5], [0, -14]);

  return { scale, y };
}
