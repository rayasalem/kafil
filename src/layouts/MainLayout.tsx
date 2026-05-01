import { FC, useLayoutEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import {
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  Bell,
  Search,
  Settings,
  Gavel,
  Scale,
  AlertCircle,
} from 'lucide-react';
import { User } from '@/types';
import { cn } from '@/shared/utils/cn';

const MainLayout: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const outlet = useOutlet();
  const lastPathRef = useRef(location.pathname);
  const userStr = localStorage.getItem('user');
  const user: User = userStr
    ? JSON.parse(userStr)
    : { role: 'client', name: 'Guest', username: 'guest', id: '0' };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  useLayoutEffect(() => {
    const prevPath = lastPathRef.current;
    const scroller = document.getElementById('app-scroll-container');

    if (prevPath && prevPath !== location.pathname && prevPath.startsWith('/dashboard')) {
      const skipSaveForPath = sessionStorage.getItem('scroll:skip-next-save');
      if (skipSaveForPath === prevPath) {
        sessionStorage.removeItem('scroll:skip-next-save');
      } else {
        const prevTop = scroller ? scroller.scrollTop : window.scrollY;
        try {
          sessionStorage.setItem(`scroll:${prevPath}`, prevTop.toString());
        } catch {
          // Ignore storage errors; scroll restoration is progressive enhancement.
        }
      }
    }

    lastPathRef.current = location.pathname;

    // Reset scroll to top for non-dashboard routes (project details, etc.)
    if (!location.pathname.startsWith('/dashboard')) {
      let frame = 0;
      const maxFrames = 8;
      let raf: number | null = null;

      if (scroller) {
        scroller.scrollTop = 0;
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }

      const resetScroll = () => {
        frame += 1;
        if (scroller) {
          scroller.scrollTop = 0;
          if (frame < maxFrames && scroller.scrollTop !== 0) {
            raf = requestAnimationFrame(resetScroll);
            return;
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'auto' });
          if (frame < maxFrames && window.scrollY !== 0) {
            raf = requestAnimationFrame(resetScroll);
            return;
          }
        }
      };

      raf = requestAnimationFrame(resetScroll);

      return () => {
        if (raf) cancelAnimationFrame(raf);
      };
    }

    // Restore scroll position for dashboard routes
    const saved = sessionStorage.getItem(`scroll:${location.pathname}`);
    if (!saved) return;

    const targetTop = parseInt(saved, 10);
    let frame = 0;
    const maxFrames = 8;

    const applyScroll = () => {
      frame += 1;

      if (scroller) {
        scroller.scrollTop = targetTop;
        if (frame < maxFrames && Math.abs(scroller.scrollTop - targetTop) > 1) {
          requestAnimationFrame(applyScroll);
          return;
        }
      } else {
        window.scrollTo({ top: targetTop, behavior: 'auto' });
        if (frame < maxFrames && Math.abs(window.scrollY - targetTop) > 1) {
          requestAnimationFrame(applyScroll);
          return;
        }
      }
    };

    requestAnimationFrame(applyScroll);

    // If the dashboard content mounts async (images, data), retry when DOM changes
    let observer: MutationObserver | null = null;
    let t1: number | null = null;
    let t2: number | null = null;

    if (scroller) {
      observer = new MutationObserver(() => {
        if (scroller && scroller.scrollHeight > targetTop) {
          scroller.scrollTop = targetTop;
          observer?.disconnect();
        }
      });
      try {
        observer.observe(scroller, { childList: true, subtree: true, attributes: true });
      } catch (e) {
        observer.disconnect();
      }
    } else {
      // Observe body changes as a fallback
      observer = new MutationObserver(() => {
        if (document.body.scrollHeight > targetTop) {
          window.scrollTo({ top: targetTop, behavior: 'auto' });
          observer?.disconnect();
        }
      });
      try {
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
      } catch (e) {
        observer.disconnect();
      }
    }

    // Fallback retries in case MutationObserver doesn't trigger quickly enough
    t1 = window.setTimeout(applyScroll, 220) as unknown as number;
    t2 = window.setTimeout(applyScroll, 600) as unknown as number;

    return () => {
      if (observer) observer.disconnect();
      if (t1) clearTimeout(t1 as unknown as number);
      if (t2) clearTimeout(t2 as unknown as number);
    };
  }, [location.pathname]);

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
    <div
      className="flex min-h-screen font-sans text-gray-900"
      style={{ background: '#F9F4EE' }}
      dir="rtl"
    >
      {/* ── SIDEBAR ── */}
      <aside className="sticky top-0 z-20 hidden h-screen w-72 flex-col bg-[#0D1B2A] lg:flex">
        {/* Logo */}
        <div className="border-b border-white/5 px-8 py-7">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A84C]">
              <ShieldCheck size={22} className="text-[#0D1B2A]" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">كفيل</span>
          </Link>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
          {menuSections.map((section) => {
            const visibleItems = section.items.filter(
              (item) => !item.roles || item.roles.includes(user.role)
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.label}>
                <p className="mb-2 px-4 text-[10px] font-black tracking-widest text-white/25 uppercase">
                  {section.label}
                </p>
                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const isActive =
                      location.pathname === item.path ||
                      (item.path !== '/create' &&
                        location.pathname.startsWith(item.path) &&
                        item.path !== `/dashboard/${user.role}`);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          'relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all',
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
                          <span
                            className={cn(
                              'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black',
                              isActive ? 'bg-[#0D1B2A] text-[#C9A84C]' : 'bg-red-500 text-white'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                        {isActive && (
                          <div className="absolute top-1/2 right-0 h-6 w-1 -translate-y-1/2 rounded-full bg-[#0D1B2A]" />
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
        <div className="border-t border-white/5 p-4">
          <div
            className="mb-3 rounded-2xl border border-[#C9A84C]/20 p-5"
            style={{ background: 'rgba(201,168,76,0.06)' }}
          >
            <p className="mb-1 text-[10px] font-black tracking-widest text-[#C9A84C] uppercase">
              نظام الضمان
            </p>
            <p className="mb-3 text-xs font-bold text-white/70">حسابك مؤمن بنسبة 100%</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-full bg-[#C9A84C]" />
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-red-400 transition-all hover:bg-red-500/10"
          >
            <LogOut size={18} /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* TOPBAR */}
        <header
          className="sticky top-0 z-10 flex h-18 items-center justify-between border-b border-[#E8DDD0] bg-white/80 px-6 backdrop-blur-md md:px-10"
          style={{ minHeight: '72px' }}
        >
          <div className="hidden w-full max-w-md items-center gap-3 rounded-2xl border border-[#E8DDD0] bg-gray-50 px-4 py-2.5 transition-all focus-within:ring-2 focus-within:ring-[#C9A84C]/20 md:flex">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن مشاريع أو مهام..."
              className="w-full border-0 bg-transparent text-sm font-medium outline-none"
            />
          </div>

          <div className="mr-auto flex items-center gap-3 lg:mr-0">
            {/* Disputes quick link — all roles */}
            <Link
              to="/disputes"
              className={cn(
                'hidden items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-all md:flex',
                location.pathname === '/disputes'
                  ? 'border-[#C9A84C] bg-[#C9A84C] text-[#0D1B2A]'
                  : 'border-[#E8DDD0] bg-white text-gray-500 hover:border-[#C9A84C]/40 hover:text-[#0D1B2A]'
              )}
            >
              <Gavel size={16} />
              النزاعات
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
                2
              </span>
            </Link>

            <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#E8DDD0] bg-white text-gray-500 transition-all hover:bg-gray-50">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
            </button>

            <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E8DDD0] bg-white text-gray-500 transition-all hover:bg-gray-50">
              <Settings size={20} />
            </button>

            <div className="mx-1 hidden h-8 w-px bg-[#E8DDD0] md:block" />

            <div className="flex items-center gap-3 rounded-2xl border border-[#E8DDD0] bg-white py-1.5 pr-1.5 pl-4 shadow-sm">
              <div className="hidden text-right md:block">
                <p className="text-xs leading-tight font-black text-[#0D1B2A]">{user.name}</p>
                <p className="text-[10px] font-bold tracking-widest text-[#C9A84C] uppercase">
                  {roleLabel[user.role] || user.role}
                </p>
              </div>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-white text-sm font-black shadow-sm"
                style={{ background: '#0D1B2A', color: '#C9A84C' }}
              >
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div id="app-scroll-container" className="relative flex-1 overflow-y-auto bg-[#F9F4EE]">
          <LayoutGroup>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={location.pathname}
                className="min-h-full w-full p-6 md:p-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {outlet}
              </motion.div>
            </AnimatePresence>
          </LayoutGroup>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
