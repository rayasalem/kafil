import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface AppleCloseButtonProps extends HTMLMotionProps<'button'> {
  iconSize?: number;
}

export const AppleCloseButton: React.FC<AppleCloseButtonProps> = ({ 
  className, 
  iconSize = 22, 
  ...props 
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic Effect Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Ultra-Smooth Spring Config
  const springConfig = { damping: 35, stiffness: 200, mass: 1 };
  const translateX = useSpring(mouseX, springConfig);
  const translateY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x * 0.35);
    mouseY.set(y * 0.35);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className={cn("relative z-[70]", className)}>
      {/* 
        THE ORBITAL GLOW
        Smooth aura breathing behind the button
      */}
      <motion.div
        animate={{
          scale: isHovered ? 1.4 : 1,
          opacity: isHovered ? 0.4 : 0.15,
        }}
        style={{ x: translateX, y: translateY }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--color-kafil-gold)] to-[var(--color-kafil-teal)] blur-2xl pointer-events-none"
      />

      <motion.button
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        
        // SEQUENCED ENTRANCE: Pop then Spin
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{
          // Scale & Opacity happen first
          scale: { type: 'spring', stiffness: 200, damping: 25 },
          opacity: { duration: 0.4 },
          // Rotation is delayed for a "locking into place" feel
          rotate: { type: 'spring', stiffness: 150, damping: 20, delay: 0.3 }
        }}

        style={{ x: translateX, y: translateY }}
        className={cn(
          "group relative flex items-center justify-center rounded-full overflow-hidden",
          "w-14 h-14 shadow-[0_12px_40px_rgba(0,0,0,0.15)]",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-kafil-gold)]/50",
        )}
        {...props}
      >
        {/* DYNAMIC GLASS BACKDROP */}
        <div className="absolute inset-0 bg-[var(--color-kafil-midnight)]/10 backdrop-blur-[32px] transition-all duration-700 group-hover:bg-[var(--color-kafil-midnight)]/20" />
        
        {/* ANIMATED BORDER LIGHT SWEEP */}
        <motion.div 
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-[-50%] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        />

        {/* STRUCTURAL STROKE */}
        <div className="absolute inset-0 rounded-full border border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]" />
        
        {/* THE ICON */}
        <motion.div
          animate={{
            rotate: isHovered ? 90 : 0,
            scale: isHovered ? 1.05 : 1
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative z-10 text-[var(--color-kafil-midnight)]"
        >
          <X size={iconSize} strokeWidth={3} />
        </motion.div>

        {/* GLOWING RING ON HOVER */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 rounded-full border-2 border-[var(--color-kafil-gold)]/30"
            />
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
