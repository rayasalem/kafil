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

  // Ultra-Smooth, Slow Spring Config for Apple feel
  const springConfig = { damping: 45, stiffness: 120, mass: 1.2 };
  const translateX = useSpring(mouseX, springConfig);
  const translateY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x * 0.3);
    mouseY.set(y * 0.3);
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
      */}
      <motion.div
        animate={{
          scale: isHovered ? 1.5 : 1,
          opacity: isHovered ? 0.35 : 0.1,
        }}
        transition={{ type: 'spring', stiffness: 80, damping: 25 }}
        style={{ x: translateX, y: translateY }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--color-kafil-gold)] to-[var(--color-kafil-teal)] blur-3xl pointer-events-none"
      />

      <motion.button
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        
        // HOVER SEQUENCE
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
        whileTap={{ scale: 0.96 }}
        
        // ENTRANCE SEQUENCE
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ 
          scale: isHovered ? 1.1 : 1, // Combined with hover state
          rotate: 0, 
          opacity: 1 
        }}
        transition={{
          scale: { type: 'spring', stiffness: 100, damping: 30 },
          opacity: { duration: 0.6 },
          rotate: { type: 'spring', stiffness: 100, damping: 20, delay: 0.4 }
        }}

        style={{ x: translateX, y: translateY }}
        className={cn(
          "group relative flex items-center justify-center rounded-full overflow-hidden",
          "w-14 h-14 shadow-[0_12px_40px_rgba(0,0,0,0.1)]",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-kafil-gold)]/50",
        )}
        {...props}
      >
        {/* DYNAMIC GLASS BACKDROP */}
        <div className="absolute inset-0 bg-[var(--color-kafil-midnight)]/10 backdrop-blur-[40px] transition-all duration-1000 group-hover:bg-[var(--color-kafil-midnight)]/20" />
        
        {/* ANIMATED BORDER LIGHT SWEEP */}
        <motion.div 
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-[-50%] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        />

        {/* STRUCTURAL STROKE */}
        <div className="absolute inset-0 rounded-full border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]" />
        
        {/* SEQUENCED ICON HOVER */}
        <motion.div
          animate={{
            rotate: isHovered ? 90 : 0,
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 80, 
            damping: 25, 
            // DELAY the icon animation relative to the button scaling
            delay: isHovered ? 0.15 : 0 
          }}
          className="relative z-10 text-[var(--color-kafil-midnight)]"
        >
          <X size={iconSize} strokeWidth={3} />
        </motion.div>

        {/* GLOWING RING ON HOVER */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border border-[var(--color-kafil-gold)]/20"
            />
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
