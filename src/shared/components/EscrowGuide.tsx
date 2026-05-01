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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0D1B2A]/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={cn(
          "bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden relative",
          isRtl ? "text-right" : "text-left"
        )}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <button 
          onClick={onClose}
          className={cn(
            "absolute top-6 p-2 text-gray-400 hover:text-gray-900 transition-colors z-10",
            isRtl ? "left-6" : "right-6"
          )}
        >
          <X size={24} />
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Left/Top Decor */}
          <div className="lg:w-1/3 bg-[#0D1B2A] p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#C9A84C] rounded-full blur-[60px] opacity-20"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-[#C9A84C] rounded-2xl flex items-center justify-center text-[#0D1B2A] mb-6">
                <Info size={24} />
              </div>
              <h2 className="text-3xl font-black mb-4 leading-tight">{t.title}</h2>
              <p className="text-blue-100/60 font-medium">{t.subtitle}</p>
            </div>
            
            <div className="relative z-10 mt-10 pt-10 border-t border-white/10">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center">
                    <Shield size={14} className="text-emerald-500" />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Kafeel Verified Security</p>
              </div>
            </div>
          </div>

          {/* Right/Bottom Content */}
          <div className="lg:w-2/3 p-10 lg:p-14 bg-gray-50/50">
            <div className="grid md:grid-cols-2 gap-6">
              {t.steps.map((step: any, index: number) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-[#C9A84C] group-hover:text-white transition-all mb-4">
                    {iconMap[step.icon as keyof typeof iconMap] || <Info size={20} />}
                  </div>
                  <h3 className="font-bold text-[#0D1B2A] mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
               <button 
                onClick={onClose}
                className="w-full bg-[#0D1B2A] text-white py-4 rounded-2xl font-black text-lg hover:bg-[#1a2b3c] transition-all shadow-xl shadow-[#0D1B2A]/20"
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
