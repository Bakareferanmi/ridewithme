'use client';

import { motion } from 'framer-motion';
import { motionTokens } from '@rwm/tokens';

/** Re-mounts on every navigation, which gives each page a soft entrance. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: motionTokens.ease }}>
      {children}
    </motion.div>
  );
}
