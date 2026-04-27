import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronLeft, Check } from 'lucide-react';
import { api } from '../services/api.js';

export default function CreateProject() {
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await api.createProject({ title, budget: Number(budget), owner: user.name, ownerUsername: user.username });
      navigate(`/projects/${data.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">إطلاق عقد ذكي ومحمي</h1>
        <p className="text-gray-500 font-medium text-lg">ارصد ميزانية المشروع في خزنة الوسيط (Escrow) ولن تدفع إلا بعد إنجاز العمل.</p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <div className="bg-white border border-gray-100 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                  <span className="bg-blue-100 text-blue-900 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> 
                  اسم المشروع التعاقدي
                </label>
                <input 
                  className="w-full bg-gray-50 border-0 p-4 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-lg" 
                  placeholder="مثال: الواجهة الأمامية لموقع المتجر" 
                  value={title} onChange={e => setTitle(e.target.value)} required 
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                  <span className="bg-blue-100 text-blue-900 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> 
                  الرصيد المحتجز (Budget)
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-4 text-gray-400 font-black">$</span>
                  <input 
                    className="w-full bg-gray-50 border-0 p-4 pl-12 pr-4 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-left font-black text-xl" 
                    dir="ltr" type="number" min="1" placeholder="5000" 
                    value={budget} onChange={e => setBudget(e.target.value)} required 
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <button disabled={loading} className="w-full bg-gray-900 text-white font-bold p-5 rounded-2xl hover:bg-black transition flex justify-center items-center gap-2 shadow-xl shadow-gray-900/10">
                  {loading ? 'أتمتة العقد...' : 'إيداع والتزام تعاقدي'} <ChevronLeft size={20}/>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-8 shadow-inner sticky top-8">
            <h4 className="font-extrabold text-blue-900 text-lg flex items-center gap-2 mb-6">
              <ShieldCheck className="text-blue-600" size={24}/> ضمان كفيل 100%
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="bg-white p-1 rounded-full shadow-sm mt-0.5"><Check size={16} className="text-emerald-500"/></div>
                <span className="text-sm text-blue-900 font-medium leading-relaxed">الرصيد يتم حجزه بخزنة غير مرئية حتى تنجز المهمة تماماً.</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-white p-1 rounded-full shadow-sm mt-0.5"><Check size={16} className="text-emerald-500"/></div>
                <span className="text-sm text-blue-900 font-medium leading-relaxed">أنت المتحكم الوحيد بقرارات الصرف في النظام عبر لوحتك.</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-white p-1 rounded-full shadow-sm mt-0.5"><Check size={16} className="text-emerald-500"/></div>
                <span className="text-sm text-blue-900 font-medium leading-relaxed">نظام كشف عدالة الأجور التلقائي يحميك من الاستغلال.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
