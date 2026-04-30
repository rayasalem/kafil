import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Briefcase, UserCheck, HeartHandshake, Settings, ArrowRight } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }
    
    localStorage.setItem('user', JSON.stringify({ 
      name: name, 
      email: email,
      username: name.toLowerCase().replace(/\s+/g, '_'), 
      role: role 
    }));
    
    navigate('/dashboard');
  };

  const roles = [
    { id: 'admin', icon: <Settings size={28}/>, title: 'صاحب النظام (Admin)', desc: 'إدارة النظام بالكامل' },
    { id: 'client', icon: <Briefcase size={28}/>, title: 'صاحب مشروع (Client)', desc: 'تمويل ومتابعة المشاريع' },
    { id: 'freelancer', icon: <UserCheck size={28}/>, title: 'مستقل (Freelancer)', desc: 'إنجاز المهام واستلام الدفعات' },
    { id: 'coordinator', icon: <HeartHandshake size={28}/>, title: 'منسق مشاريع (Coordinator)', desc: 'متابعة المشاريع فنياً' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 rtl flex flex-col font-sans">
      <nav className="p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition font-bold">
          <ArrowRight size={20} />
          العودة للرئيسية
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4 pb-12">
        <div className="bg-white rounded-[2rem] shadow-xl p-8 max-w-2xl w-full animate-fade-in border border-gray-100">
          
          <div className="text-center mb-8">
             <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
               <ShieldCheck size={32} className="text-blue-600"/>
             </div>
             <h3 className="text-3xl font-black text-gray-900">إنشاء حساب جديد</h3>
             <p className="text-gray-500 mt-2">انضم إلى كفيل وابدأ بإدارة أعمالك بأمان وموثوقية</p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 font-bold text-sm text-center border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">اسم المستخدم كاملاً</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: Ahmed Khaled"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg bg-gray-50 focus:bg-white"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-left"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-left tracking-widest"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
               <label className="block text-sm font-bold text-gray-700 mb-4 mt-2">اختر نوع الحساب (الصلاحية)</label>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {roles.map(r => (
                   <button
                     key={r.id}
                     type="button"
                     onClick={() => setRole(r.id)}
                     className={`p-4 rounded-xl border-2 text-right transition-all flex items-start gap-4 ${role === r.id ? 'border-blue-600 bg-blue-50 shadow-md shadow-blue-100' : 'border-gray-100 hover:border-blue-300 hover:bg-gray-50'}`}
                   >
                     <div className={`p-3 rounded-lg ${role === r.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                       {r.icon}
                     </div>
                     <div>
                       <h4 className={`font-bold text-lg mb-1 ${role === r.id ? 'text-blue-900' : 'text-gray-900'}`}>{r.title}</h4>
                       <p className={`text-sm ${role === r.id ? 'text-blue-700 font-medium' : 'text-gray-500'}`}>{r.desc}</p>
                     </div>
                   </button>
                 ))}
               </div>
            </div>

            <button type="submit" className="w-full bg-blue-900 text-white font-bold py-4 rounded-xl text-lg hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20 mt-4">
              إنشاء الحساب ودخول المنصة
            </button>
            
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-gray-500 font-medium">
                لديك حساب بالفعل؟ <Link to="/login" className="text-blue-600 font-bold hover:text-blue-800 transition">سجل دخولك من هنا</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
