import { useState, FC, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, User as UserIcon, Mail, ArrowLeft, ArrowRight, Briefcase, Globe } from 'lucide-react';
import { User, UserRole } from '@/types';
import { useLanguage } from '@/shared/context/LanguageContext';
import { translations } from '@/shared/translations';
import { cn } from '@/shared/utils/cn';

const Register: FC = () => {
  const { lang, toggleLang, isRtl } = useLanguage();
  const tFull = translations.auth[lang];
  const t = tFull.register;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const navigate = useNavigate();

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: username,
      role: role,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      email: email,
      avatar: undefined,
      joinedAt: new Date().toISOString(),
      trustScore: 95,
      balance: role === 'client' ? 5000 : 0,
      lockedFunds: 0
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    navigate(`/dashboard/${role}`);
  };

  return (
    <div className={cn("min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans transition-all", isRtl ? 'rtl' : 'ltr')} dir={isRtl ? 'rtl' : 'ltr'}>
      <button 
        onClick={toggleLang}
        className="absolute top-6 right-6 lg:top-8 lg:right-8 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
      >
        <Globe size={16} />
        {lang === 'ar' ? 'English' : 'عربي'}
      </button>

      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-0"></div>
        
        <div className="relative z-10">
          <div className="text-3xl font-black text-blue-900 flex items-center gap-2 mb-10 tracking-tight">
            <ShieldCheck size={36} className="text-green-500" /> كفيل
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-2">{t.title}</h2>
          <p className="text-gray-400 font-medium mb-8">{t.subtitle}</p>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">{t.fullName}</label>
              <div className="relative">
                <UserIcon className={cn("absolute top-1/2 -translate-y-1/2 text-gray-400", isRtl ? 'right-4' : 'left-4')} size={20} />
                <input 
                  type="text" 
                  className={cn(
                    "w-full bg-gray-50 border-0 p-4 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none font-medium",
                    isRtl ? 'pr-12' : 'pl-12'
                  )}
                  placeholder={t.fullName}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">{t.email}</label>
              <div className="relative">
                <Mail className={cn("absolute top-1/2 -translate-y-1/2 text-gray-400", isRtl ? 'right-4' : 'left-4')} size={20} />
                <input 
                  type="email" 
                  className={cn(
                    "w-full bg-gray-50 border-0 p-4 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none font-medium",
                    isRtl ? 'pr-12' : 'pl-12'
                  )}
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">{t.role}</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setRole('client')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'client' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                >
                  <Briefcase size={24} />
                  <span className="font-bold text-sm">{t.client}</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('freelancer')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'freelancer' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                >
                  <UserIcon size={24} />
                  <span className="font-bold text-sm">{t.freelancer}</span>
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-900 text-white font-bold py-4 rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 text-lg group mt-4">
              {t.btn} 
              {isRtl ? (
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              ) : (
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-gray-500 font-medium">{t.hasAccount} <Link to="/login" className="text-blue-600 font-bold hover:underline">{t.loginLink}</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
