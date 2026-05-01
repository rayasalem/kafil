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

  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const translateX = useSpring(mouseX, springConfig);
  const translateY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Limit the pull to 15px
    mouseX.set(x * 0.4);
    mouseY.set(y * 0.4);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className={cn("relative z-[70]", className)}>
      {/* 
        1. THE ORBITAL GLOW (The "Impressive" factor)
        A soft, breathing aura that follows the button
      */}
      <motion.div
        animate={{
          scale: isHovered ? 1.4 : 1,
          opacity: isHovered ? 0.6 : 0.2,
        }}
        style={{ x: translateX, y: translateY }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--color-kafil-gold)] to-[var(--color-kafil-teal)] blur-2xl pointer-events-none"
      />

      <motion.button
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, rotate: -90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 260, 
          damping: 20,
          layout: { duration: 0.3 }
        }}
        style={{ x: translateX, y: translateY }}
        className={cn(
          "group relative flex items-center justify-center rounded-full overflow-hidden",
          "w-14 h-14 shadow-[0_12px_40px_rgba(0,0,0,0.2)]",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-kafil-gold)]/50",
        )}
        {...props}
      >
        {/* 2. DYNAMIC GLASS BACKDROP */}
        <div className="absolute inset-0 bg-[var(--color-kafil-midnight)]/10 backdrop-blur-[32px] transition-all duration-500 group-hover:bg-[var(--color-kafil-midnight)]/20" />
        
        {/* 3. ANIMATED BORDER LIGHT */}
        <motion.div 
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-[-50%] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        />

        {/* 4. STRUCTURAL STROKE */}
        <div className="absolute inset-0 rounded-full border border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]" />
        
        {/* 5. THE ICON with INTERNAL MOTION */}
        <motion.div
          animate={{
            rotate: isHovered ? 90 : 0,
            scale: isHovered ? 1.1 : 1
          }}
          className="relative z-10 text-[var(--color-kafil-midnight)]"
        >
          <X size={iconSize} strokeWidth={3} />
        </motion.div>

        {/* 6. GLOWING RING ON HOVER */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="absolute inset-0 rounded-full border-2 border-[var(--color-kafil-gold)]/50"
            />
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
