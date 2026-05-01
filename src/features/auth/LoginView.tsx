import { useState, FC, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, User as UserIcon, ArrowLeft } from 'lucide-react';
import { User } from '@/types';
import { api } from '@/services/api';

const Login: FC = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'client' | 'freelancer' | 'admin' | 'coordinator'>('client');
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const user = await api.login(username, '');
      localStorage.setItem('user', JSON.stringify(user));
      navigate(`/dashboard/${user.role}`);
    } catch (err: any) {
      alert(err.message || 'فشل تسجيل الدخول');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0"></div>
        
        <div className="relative z-10">
          <div className="text-3xl font-black text-blue-900 flex items-center gap-2 mb-10 tracking-tight">
            <ShieldCheck size={36} className="text-green-500" /> كفيل
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-2">مرحباً بك مجدداً</h2>
          <p className="text-gray-400 font-medium mb-8">سجل دخولك للوصول إلى خزنتك المالية الآمنة</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">اسم المستخدم</label>
              <div className="relative">
                <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-0 p-4 pr-12 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none font-medium"
                  placeholder="ahmed_k"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-900 text-white font-bold py-4 rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 text-lg group">
              دخول <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest text-center">بيانات تجريبية (Hackathon Simulation)</p>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-600">
              <div className="bg-white p-1.5 rounded-lg border border-gray-100">
                <span className="text-blue-600 block">Client:</span> ahmed_k
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-gray-100">
                <span className="text-purple-600 block">Freelancer:</span> omar_dev
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-gray-100">
                <span className="text-emerald-600 block">Coordinator:</span> tariq_pm
              </div>
              <div className="bg-white p-1.5 rounded-lg border border-gray-100">
                <span className="text-red-600 block">Admin:</span> kafil_admin
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-gray-500 font-medium">ليس لديك حساب؟ <Link to="/register" className="text-blue-600 font-bold hover:underline">أنشئ حساباً الآن</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
