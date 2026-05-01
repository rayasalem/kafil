import { useState, FC, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, DollarSign, FileText, ArrowLeft, ShieldCheck, Globe } from 'lucide-react';
import { api } from '@/services/api';
import { User } from '@/types';
import { useLanguage } from '@/shared/context/LanguageContext';
import { translations } from '@/shared/translations';
import { cn } from '@/shared/utils/cn';

const CreateProject: FC = () => {
  const { lang, isRtl } = useLanguage();
  const tFull = translations.dashboard[lang];
  const t = tFull.client.createProjectForm;
  
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const user: User = userStr ? JSON.parse(userStr) : { role: 'client', name: 'Guest', username: 'guest', id: '0' };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newProject = await api.createProject({
        title,
        budget: Number(budget),
        ownerId: user.id,
      });
      navigate(`/projects/${newProject.id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to create project');
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className={cn("mb-10 text-center", isRtl ? "md:text-right" : "md:text-left")}>
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">{t.title}</h1>
        <p className="text-gray-500 text-lg font-medium">{t.subtitle}</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/5 relative overflow-hidden">
        <div className={cn("absolute top-0 w-32 h-32 bg-blue-50 rounded-br-full -z-0", isRtl ? "right-0" : "left-0")}></div>
        
        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
          <div className="space-y-2">
            <label className={cn("block text-lg font-bold text-gray-800 flex items-center gap-2", isRtl ? "mr-2" : "ml-2")}>
              <FileText size={20} className="text-blue-600"/> {t.projectName}
            </label>
            <input 
              className={cn(
                "w-full bg-gray-50 border-0 p-5 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none font-bold text-xl placeholder-gray-300",
                isRtl ? "text-right" : "text-left"
              )}
              placeholder={t.projectPlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className={cn("block text-lg font-bold text-gray-800 flex items-center gap-2", isRtl ? "mr-2" : "ml-2")}>
              <DollarSign size={20} className="text-green-600"/> {t.totalBudget}
            </label>
            <div className="relative">
               <span className={cn("absolute top-1/2 -translate-y-1/2 font-black text-2xl text-gray-400", isRtl ? "right-5" : "left-5")}>$</span>
               <input 
                className={cn(
                  "w-full bg-gray-50 border-0 p-5 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none font-black text-3xl text-blue-900",
                  isRtl ? "pr-12 text-right" : "pl-12 text-left"
                )}
                type="number"
                min="10"
                placeholder="500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>
            <p className={cn("text-sm text-gray-400 font-medium", isRtl ? "mr-2" : "ml-2")}>{t.budgetHelp}</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
            <div className="bg-white p-2 rounded-xl text-blue-600 shadow-sm shrink-0">
               <ShieldCheck size={24}/>
            </div>
            <div>
              <h4 className="font-bold text-blue-900 mb-1">{t.guaranteeTitle}</h4>
              <p className="text-sm text-blue-700/70 font-medium leading-relaxed">{t.guaranteeDescription}</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col md:flex-row gap-4">
            <button type="submit" className="flex-1 bg-blue-900 text-white font-black py-5 rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 text-xl group">
              {t.submitBtn} <Plus size={24} />
            </button>
            <button type="button" onClick={() => navigate(-1)} className="px-10 py-5 rounded-2xl border-2 border-gray-100 text-gray-500 font-bold hover:bg-gray-50 transition-all">
              {t.cancelBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
