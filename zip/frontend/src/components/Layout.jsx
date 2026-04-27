import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, LogOut, ShieldCheck, UserCircle2 } from 'lucide-react';
import { useEffect } from 'react';
import DemoButton from './DemoButton.jsx';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path ? "bg-blue-900 text-white font-bold shadow-md shadow-blue-900/20" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 font-medium";

  // Hide sidebar on the landing page
  if (location.pathname === '/') {
    return <Outlet />;
  }

  const user = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
     if (!user && location.pathname !== '/login' && location.pathname !== '/register') {
        navigate('/login');
     }
  }, [user, location, navigate]);

  if (!user) return null;

  const dashboardPath = `/dashboard/${user.role}`;

  return (
    <div className="flex bg-[#F9FAFB] min-h-screen font-sans rtl">
      <aside className="w-72 bg-white border-l border-gray-100 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] hidden md:flex sticky top-0 h-screen">
        <div className="p-8 border-b border-gray-50 flex-none">
          <Link to="/" className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3 group">
            <span className="bg-blue-900 text-white rounded-2xl p-2.5 shadow-lg shadow-blue-900/20 group-hover:bg-blue-800 transition"><ShieldCheck size={28}/></span> 
            كفيل
          </Link>
        </div>
        
         {/* User Card */}
        <div className="px-6 py-5 border-b border-gray-50 flex-none">
           <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
             <div className="bg-blue-100 text-blue-800 p-2.5 rounded-full"><UserCircle2 size={24}/></div>
             <div className="overflow-hidden flex-1">
               <p className="font-extrabold text-gray-900 text-sm truncate">{user.name || 'ضيف'}</p>
               <p className="text-xs text-gray-500 font-bold bg-white border border-gray-200 px-2 py-0.5 rounded mt-1 inline-block">
                 {user.role === 'admin' ? 'مدير النظام' : 
                  user.role === 'client' ? 'حساب العميل' : 
                  user.role === 'freelancer' ? 'مستقل' : 
                  user.role === 'coordinator' ? 'منسق' : 'مدير النظام'}
               </p>
             </div>
           </div>
        </div>

        <div className="px-6 py-4 flex-1 overflow-y-auto">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block px-2">القائمة الرئيسية</span>
          <nav className="space-y-2">
            <Link to={dashboardPath} className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 ${isActive(dashboardPath)}`}>
              <LayoutDashboard size={20} />
              <span>الخزنة المركزية</span>
            </Link>
            {(user.role === 'client' || user.role === 'admin') && (
              <Link to="/create" className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 ${isActive('/create')}`}>
                <PlusCircle size={20} />
                <span>إطلاق مشروع جديد</span>
              </Link>
            )}
          </nav>
        </div>
        
        <div className="p-6 space-y-4 border-t border-gray-50 flex-none bg-white">
          <DemoButton />
          <Link to="/" onClick={() => localStorage.clear()} className="flex items-center gap-3 justify-center px-4 py-3.5 text-gray-500 hover:bg-gray-100 hover:text-red-600 rounded-2xl transition-colors font-bold border border-transparent hover:border-gray-200">
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 w-full max-w-[100vw] md:max-w-none overflow-x-hidden p-6 md:p-12">
        <div className="md:hidden flex flex-col gap-4 bg-white p-5 rounded-3xl shadow-sm mb-8 border border-gray-100">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <span className="bg-blue-900 text-white rounded-xl p-1.5"><ShieldCheck size={20}/></span> كفيل
            </Link>
            <div className="flex gap-4">
              <Link to={dashboardPath} className="text-gray-500 font-bold">الخزنة</Link>
              {(!user.role || user.role === 'client') && (
                <Link to="/create" className="text-gray-500 font-bold">إضافة</Link>
              )}
            </div>
          </div>
          <DemoButton />
        </div>
        <Outlet />
      </main>
    </div>
  );
}
