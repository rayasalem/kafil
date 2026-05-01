import { FC } from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, Zap, Scale, X, Info } from 'lucide-react';
import { useLanguage } from '@/shared/context/LanguageContext';
import { translations } from '@/shared/translations';
import { cn } from '@/shared/utils/cn';

interface EscrowGuideProps {
  onClose: () => void;
}

const iconMap = {
  Lock: <Lock size={24} />,
  Shield: <Shield size={24} />,
  Zap: <Zap size={24} />,
  Scale: <Scale size={24} />,
};

export const EscrowGuide: FC<EscrowGuideProps> = ({ onClose }) => {
  const { lang, isRtl } = useLanguage();
  const t = translations.guide[lang];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0D1B2A]/80 p-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={cn(
          'relative w-full max-w-4xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl',
          isRtl ? 'text-right' : 'text-left'
        )}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <button
          onClick={onClose}
          className={cn(
            'absolute top-6 z-10 p-2 text-gray-400 transition-colors hover:text-gray-900',
            isRtl ? 'left-6' : 'right-6'
          )}
        >
          <X size={24} />
        </button>

        <div className="flex h-full flex-col lg:flex-row">
          {/* Left/Top Decor */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-[#0D1B2A] p-10 text-white lg:w-1/3">
            <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-[#C9A84C] opacity-20 blur-[60px]"></div>
            <div className="relative z-10">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A84C] text-[#0D1B2A]">
                <Info size={24} />
              </div>
              <h2 className="mb-4 text-3xl leading-tight font-black">{t.title}</h2>
              <p className="font-medium text-blue-100/60">{t.subtitle}</p>
            </div>

            <div className="relative z-10 mt-10 border-t border-white/10 pt-10">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
                  <Shield size={14} className="text-emerald-500" />
                </div>
                <p className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">
                  Kafeel Verified Security
                </p>
              </div>
            </div>
          </div>

          {/* Right/Bottom Content */}
          <div className="bg-gray-50/50 p-10 lg:w-2/3 lg:p-14">
            <div className="grid gap-6 md:grid-cols-2">
              {t.steps.map((step: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-all group-hover:bg-[#C9A84C] group-hover:text-white">
                    {iconMap[step.icon as keyof typeof iconMap] || <Info size={20} />}
                  </div>
                  <h3 className="mb-2 font-bold text-[#0D1B2A]">{step.title}</h3>
                  <p className="text-sm leading-relaxed font-medium text-gray-500">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
              <button
                onClick={onClose}
                className="w-full rounded-2xl bg-[#0D1B2A] py-4 text-lg font-black text-white shadow-xl shadow-[#0D1B2A]/20 transition-all hover:bg-[#1a2b3c]"
              >
                {t.cta}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
