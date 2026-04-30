import { FC } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, LogOut, LayoutDashboard, PlusCircle, Bell, Search, Settings } from 'lucide-react';
import { User } from '../types';

const Layout: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  const user: User = userStr ? JSON.parse(userStr) : { role: 'client', name: 'Guest', username: 'guest', id: '0' };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { name: 'الرئيسية', icon: <LayoutDashboard size={20}/>, path: `/dashboard/${user.role}` },
    { name: 'فتح مشروع', icon: <PlusCircle size={20}/>, path: '/create', roles: ['client', 'admin'] },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-gray-900" dir="rtl">
      
      {/* 🟢 SIDEBAR */}
      <aside className="w-72 bg-white border-l border-gray-100 hidden lg:flex flex-col sticky top-0 h-screen z-20">
        <div className="p-8">
          <Link to="/" className="text-2xl font-black text-blue-900 flex items-center gap-3 tracking-tight">
            <ShieldCheck className="text-green-500" size={32}/> كفيل
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-4 mt-2">القائمة الرئيسية</div>
          {menuItems.filter(item => !item.roles || item.roles.includes(user.role)).map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${location.pathname === item.path ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
            >
              <span className={`${location.pathname === item.path ? 'text-blue-600' : 'text-gray-400'}`}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl shadow-blue-900/10">
             <div className="absolute -top-4 -left-4 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
             <div className="relative z-10">
                <p className="text-xs font-bold text-blue-300 mb-1 uppercase tracking-wider">نظام الضمان</p>
                <h4 className="font-bold text-sm mb-3">حسابك مؤمن بنسبة 100%</h4>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-green-400 h-full w-full"></div>
                </div>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 mt-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20}/> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* 🔵 MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOPBAR */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-10">
           <div className="flex items-center gap-4 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100 w-full max-w-md hidden md:flex focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search size={18} className="text-gray-400"/>
              <input type="text" placeholder="ابحث عن مشاريع أو مهام..." className="bg-transparent border-0 outline-none w-full text-sm font-medium"/>
           </div>

           <div className="flex items-center gap-3 mr-auto lg:mr-0">
              <button className="w-11 h-11 bg-white border border-gray-100 rounded-1.5xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all relative">
                 <Bell size={20}/>
                 <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button className="w-11 h-11 bg-white border border-gray-100 rounded-1.5xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all">
                 <Settings size={20}/>
              </button>
              <div className="h-8 w-px bg-gray-100 mx-2 hidden md:block"></div>
              <div className="flex items-center gap-3 bg-white border border-gray-100 pl-4 pr-1.5 py-1.5 rounded-2xl shadow-sm">
                 <div className="text-left hidden md:block">
                    <p className="text-xs font-black text-gray-900 leading-tight">{user.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user.role}</p>
                 </div>
                 <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 font-black text-sm border-2 border-white shadow-sm">
                    {user.name.charAt(0)}
                 </div>
              </div>
           </div>
        </header>

        <div className="p-6 md:p-10 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default Layout;
