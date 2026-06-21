'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export function FabButton() {
  const pathname = usePathname();
  const router = useRouter();

  // Only show on dashboard
  if (pathname !== '/dashboard') return null;

  return (
    <motion.button
      className="fab"
      onClick={() => router.push('/log')}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: 0.5,
      }}
      aria-label="Quick Log"
    >
      <Plus className="w-6 h-6" strokeWidth={2.5} />
    </motion.button>
  );
}
