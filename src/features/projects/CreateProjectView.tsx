import { useState, FC, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, DollarSign, FileText, ArrowLeft, ShieldCheck } from 'lucide-react';
import { api } from '@/services/api';
import { User } from '@/types';

const CreateProject: FC = () => {
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const user: User = userStr ? JSON.parse(userStr) : { role: 'client', name: 'Guest', username: 'guest', id: '0' };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newProject = await api.createProject({
      title,
      budget: Number(budget),
      owner: user.name,
      ownerUsername: user.username
    });
    navigate(`/projects/${newProject.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-10 text-center md:text-right">
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">فتح خزنة مشروع جديدة</h1>
        <p className="text-gray-500 text-lg font-medium">ابدأ بتأمين ميزانية مشروعك لضمان حقوق الجميع</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50 rounded-br-full -z-0"></div>
        
        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
          <div className="space-y-2">
            <label className="block text-lg font-bold text-gray-800 mr-2 flex items-center gap-2">
              <FileText size={20} className="text-blue-600"/> اسم المشروع
            </label>
            <input 
              className="w-full bg-gray-50 border-0 p-5 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none font-bold text-xl placeholder-gray-300"
              placeholder="مثال: تطوير متجر إلكتروني متكامل"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-bold text-gray-800 mr-2 flex items-center gap-2">
              <DollarSign size={20} className="text-green-600"/> ميزانية المشروع الإجمالية
            </label>
            <div className="relative">
               <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-2xl text-gray-400">$</span>
               <input 
                className="w-full bg-gray-50 border-0 p-5 pr-12 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none font-black text-3xl text-blue-900"
                type="number"
                min="10"
                placeholder="500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>
            <p className="text-sm text-gray-400 font-medium mr-2">هذا المبلغ سيتم حجزه في "خزنة كفيل" ولن يتم تحريكه إلا باعتمادك للمهام.</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
            <div className="bg-white p-2 rounded-xl text-blue-600 shadow-sm shrink-0">
               <ShieldCheck size={24}/>
            </div>
            <div>
              <h4 className="font-bold text-blue-900 mb-1">ضمان كفيل المالي</h4>
              <p className="text-sm text-blue-700/70 font-medium leading-relaxed">بإنشائك لهذا المشروع، أنت توافق على إيداع الميزانية كضمان. كفيل يضمن حقك في استلام العمل المتفق عليه قبل الإفراج عن أي دولار للمستقل.</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col md:flex-row gap-4">
            <button type="submit" className="flex-1 bg-blue-900 text-white font-black py-5 rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 text-xl group">
              إنشاء الخزنة <Plus size={24} />
            </button>
            <button type="button" onClick={() => navigate(-1)} className="px-10 py-5 rounded-2xl border-2 border-gray-100 text-gray-500 font-bold hover:bg-gray-50 transition-all">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
