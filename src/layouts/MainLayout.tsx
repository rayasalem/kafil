import { FC } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck, LogOut, LayoutDashboard, PlusCircle,
  Bell, Search, Settings, Gavel, Scale, AlertCircle
} from 'lucide-react';
import { User } from '@/types';
import { cn } from '@/shared/utils/cn';

const MainLayout: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  const user: User = userStr ? JSON.parse(userStr) : { role: 'client', name: 'Guest', username: 'guest', id: '0' };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuSections = [
    {
      label: 'القائمة الرئيسية',
      items: [
        {
          name: 'الرئيسية',
          icon: <LayoutDashboard size={20} />,
          path: `/dashboard/${user.role}`,
          roles: null,
        },
        {
          name: 'فتح مشروع',
          icon: <PlusCircle size={20} />,
          path: '/create',
          roles: ['client'],
        },
      ],
    },
    {
      label: 'النزاعات والتحكيم',
      items: [
        {
          name: 'نزاعاتي',
          icon: <AlertCircle size={20} />,
          path: '/disputes',
          roles: ['client', 'freelancer', 'coordinator'],
          badge: 2,
        },
        {
          name: 'مركز التحكيم',
          icon: <Scale size={20} />,
          path: '/arbitration',
          roles: null, // Open to all roles
        },
      ],
    },
  ];

  const roleLabel: Record<string, string> = {
    client: 'عميل',
    freelancer: 'مستقل',
    coordinator: 'منسق',
    arbitrator: 'محكّم',
    admin: 'مدير',
  };

  return (
    <div className="min-h-screen flex font-sans text-gray-900" style={{ background: '#F9F4EE' }} dir="rtl">

      {/* ── SIDEBAR ── */}
      <aside className="w-72 bg-[#0D1B2A] hidden lg:flex flex-col sticky top-0 h-screen z-20">

        {/* Logo */}
        <div className="px-8 py-7 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A84C] flex items-center justify-center">
              <ShieldCheck size={22} className="text-[#0D1B2A]" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">كفيل</span>
          </Link>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {menuSections.map(section => {
            const visibleItems = section.items.filter(
              item => !item.roles || item.roles.includes(user.role)
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.label}>
                <p className="text-[10px] font-black text-white/25 uppercase tracking-widest px-4 mb-2">
                  {section.label}
                </p>
                <div className="space-y-1">
                  {visibleItems.map(item => {
                    const isActive = location.pathname === item.path ||
                      (item.path !== '/create' && location.pathname.startsWith(item.path) && item.path !== `/dashboard/${user.role}`);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all relative',
                          isActive
                            ? 'bg-[#C9A84C] text-[#0D1B2A] shadow-lg shadow-[#C9A84C]/20'
                            : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                        )}
                      >
                        <span className={isActive ? 'text-[#0D1B2A]' : 'text-white/40'}>
                          {item.icon}
                        </span>
                        <span className="flex-1">{item.name}</span>
                        {'badge' in item && item.badge && (
                          <span className={cn(
                            'w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center',
                            isActive ? 'bg-[#0D1B2A] text-[#C9A84C]' : 'bg-red-500 text-white'
                          )}>
                            {item.badge}
                          </span>
                        )}
                        {isActive && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#0D1B2A] rounded-full" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Bottom: escrow card + logout */}
        <div className="p-4 border-t border-white/5">
          <div className="rounded-2xl p-5 mb-3 border border-[#C9A84C]/20" style={{ background: 'rgba(201,168,76,0.06)' }}>
            <p className="text-[10px] font-black text-[#C9A84C] uppercase tracking-widest mb-1">
              نظام الضمان
            </p>
            <p className="text-xs font-bold text-white/70 mb-3">حسابك مؤمن بنسبة 100%</p>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#C9A84C] h-full w-full" />
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* TOPBAR */}
        <header className="h-18 bg-white/80 backdrop-blur-md border-b border-[#E8DDD0] flex items-center justify-between px-6 md:px-10 sticky top-0 z-10" style={{ minHeight: '72px' }}>
          <div className="hidden md:flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-2xl border border-[#E8DDD0] w-full max-w-md focus-within:ring-2 focus-within:ring-[#C9A84C]/20 transition-all">
            <Search size={18} className="text-gray-400" />
            <input type="text" placeholder="ابحث عن مشاريع أو مهام..." className="bg-transparent border-0 outline-none w-full text-sm font-medium" />
          </div>

          <div className="flex items-center gap-3 mr-auto lg:mr-0">
            {/* Disputes quick link — all roles */}
            <Link
              to="/disputes"
              className={cn(
                'hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border',
                location.pathname === '/disputes'
                  ? 'bg-[#C9A84C] text-[#0D1B2A] border-[#C9A84C]'
                  : 'bg-white border-[#E8DDD0] text-gray-500 hover:border-[#C9A84C]/40 hover:text-[#0D1B2A]'
              )}
            >
              <Gavel size={16} />
              النزاعات
              <span className="bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </Link>

            <button className="w-11 h-11 bg-white border border-[#E8DDD0] rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            <button className="w-11 h-11 bg-white border border-[#E8DDD0] rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all">
              <Settings size={20} />
            </button>

            <div className="h-8 w-px bg-[#E8DDD0] mx-1 hidden md:block" />

            <div className="flex items-center gap-3 bg-white border border-[#E8DDD0] pl-4 pr-1.5 py-1.5 rounded-2xl shadow-sm">
              <div className="text-right hidden md:block">
                <p className="text-xs font-black text-[#0D1B2A] leading-tight">{user.name}</p>
                <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest">
                  {roleLabel[user.role] || user.role}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border-2 border-white shadow-sm"
                style={{ background: '#0D1B2A', color: '#C9A84C' }}>
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

export default MainLayout;
