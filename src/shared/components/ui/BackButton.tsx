import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useAuth } from '@/shared/hooks/useAuth';
import { useLanguage } from '@/shared/context/LanguageContext';

export const BackButton = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isRtl } = useLanguage();

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      // Fallback
      if (user?.role === 'admin') navigate('/dashboard/admin');
      else if (user?.role === 'client') navigate('/dashboard/client');
      else if (user?.role === 'freelancer') navigate('/dashboard/freelancer');
      else if (user?.role === 'coordinator') navigate('/dashboard/coordinator');
      else navigate('/');
    }
  };

  return (
    <button
      onClick={handleBack}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all active:scale-95",
        className
      )}
    >
      {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
      <span>Back</span>
    </button>
  );
};
