import { useState, FC, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, User as UserIcon, Mail, ArrowLeft, Briefcase } from 'lucide-react';
import { User, UserRole } from '../types';

const Register: FC = () => {
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
      name: username.charAt(0).toUpperCase() + username.slice(1)
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    navigate(`/dashboard/${role}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-0"></div>
        
        <div className="relative z-10">
          <div className="text-3xl font-black text-blue-900 flex items-center gap-2 mb-10 tracking-tight">
            <ShieldCheck size={36} className="text-green-500" /> كفيل
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-2">انضم إلى كفيل</h2>
          <p className="text-gray-400 font-medium mb-8">ابدأ بتأمين معاملاتك المالية اليوم</p>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">اسم المستخدم</label>
              <div className="relative">
                <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-0 p-4 pr-12 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none font-medium"
                  placeholder="اسمك بالكامل"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="email" 
                  className="w-full bg-gray-50 border-0 p-4 pr-12 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none font-medium"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">أريد التسجيل كـ</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setRole('client')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'client' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                >
                  <Briefcase size={24} />
                  <span className="font-bold text-sm">صاحب مشروع</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('freelancer')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'freelancer' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                >
                  <UserIcon size={24} />
                  <span className="font-bold text-sm">مستقل</span>
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-900 text-white font-bold py-4 rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 text-lg group mt-4">
              إنشاء الحساب <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-gray-500 font-medium">لديك حساب بالفعل؟ <Link to="/login" className="text-blue-600 font-bold hover:underline">سجل دخولك</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
