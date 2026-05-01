import { useEffect, useRef, useLayoutEffect, useState } from 'react';
import {
  ShieldCheck,
  ArrowLeft,
  AlertTriangle,
  Lock,
  Briefcase,
  Zap,
  CheckCircle,
  BrainCircuit,
  Scale,
  ChevronDown,
  HeartHandshake,
  UserCheck,
  MousePointer2,
  Sparkles,
  Fingerprint,
  Moon,
  Sun,
} from 'lucide-react';
import KafilLogo, { KafilMark } from '@/components/KafilLogo';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { cn } from '@/shared/utils/cn';
import { useLanguage } from '@/shared/context/LanguageContext';
import { landingTranslations } from '@/shared/translations/landing';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

export default function Landing() {
  const { lang, toggleLang, isRtl } = useLanguage();
  const t = landingTranslations[lang];
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Initial section set
  useEffect(() => {
    setActiveSection('home');
  }, []);

  // Initialize Smooth Scrolling (Lenis)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // GSAP Animations
  useGSAP(
    () => {
      // Hero Text Animation
      const heroTl = gsap.timeline();

      heroTl
        .from('.char', {
          opacity: 0,
          y: 100,
          rotateX: -90,
          stagger: 0.02,
          duration: 1,
          ease: 'expo.out',
        })
        .from(
          '.hero-sub',
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .from(
          '.hero-btn',
          {
            opacity: 0,
            scale: 0.8,
            stagger: 0.1,
            duration: 0.6,
            ease: 'back.out(1.7)',
          },
          '-=0.4'
        );

      // Hero Vault Cinematic Animation
      const vaultTl = gsap.timeline({
        repeat: -1,
        repeatDelay: 3,
      });

      vaultTl
        .to('.escrow-vault', { opacity: 1, scale: 1, duration: 1.2, ease: 'power4.out' })
        .to('.source-node', { opacity: 1, y: 20, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.7')
        .to('.input-flow', { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' })
        .to('.source-node', { opacity: 0, scale: 0.8, duration: 0.5 }, '-=0.3')
        .to('.vault-progress', { width: '100%', duration: 2, ease: 'power2.inOut' })
        .to('.vault-pulse', { scale: 1.6, opacity: 0, duration: 1, repeat: 1, yoyo: true }, '-=1.8')
        .to(
          '.escrow-vault',
          { boxShadow: '0 0 60px rgba(201, 168, 76, 0.4)', duration: 0.6 },
          '-=0.6'
        )
        .to('.output-flow-1, .output-flow-2', {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power3.inOut',
          stagger: 0.15,
        })
        .to(
          '.alloc-node-1, .alloc-node-2',
          { opacity: 1, y: 0, duration: 1, ease: 'back.out(1.2)', stagger: 0.3 },
          '-=1'
        )
        .to('.outcome-text', { opacity: 1, y: -5, duration: 0.5 }, '-=0.5')
        .to(
          '.success-overlay',
          { opacity: 1, scale: 1, duration: 0.8, ease: 'power4.out' },
          '-=0.2'
        )
        .to(
          '.escrow-vault, .alloc-node-1, .alloc-node-2',
          { opacity: 0.3, filter: 'blur(4px)', duration: 0.8 },
          '-=0.8'
        );

      vaultTl
        .to({}, { duration: 3 })
        .to('.success-overlay, .escrow-vault, .alloc-node-1, .alloc-node-2, .outcome-text', {
          opacity: 0,
          duration: 0.8,
        })
        .set('.input-flow, .output-flow-1, .output-flow-2', { strokeDashoffset: 1000 })
        .set('.source-node', { opacity: 0, y: 0, scale: 1 })
        .set('.vault-progress', { width: '0%' })
        .set('.escrow-vault', {
          scale: 0.95,
          boxShadow: '0 0 40px rgba(201, 168, 76, 0.15)',
          filter: 'blur(0px)',
        })
        .set('.alloc-node-1, .alloc-node-2', { y: 40 });

      // Apple-Style Morph Narrative (Section 3) - Maximum Snappiness
      const morphTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#about',
          start: 'top top',
          end: '+=120%', // Tightened to prevent dead scroll
          scrub: 0.8, // Slightly smoother scrub for better feel
          pin: true,
          anticipatePin: 1,
        },
      });

      morphTl
        // 1. Rapidly clear the old state
        .to('.traditional-card', {
          x: -100,
          opacity: 0,
          scale: 0.85,
          filter: 'blur(15px)',
          duration: 0.8,
        })
        .to('.morph-bg', { backgroundColor: '#0D1B2A', duration: 0.8 }, 0)
        .to('.morph-headline', { color: '#FFFFFF', duration: 0.8 }, 0)

        // 2. Reveal the new state immediately after
        .fromTo(
          '.kafeel-assembly-container',
          { scale: 0.9, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
          '-=0.4'
        )

        // 3. Final touch of security activation
        .to(
          '.secure-circuit-path',
          {
            strokeDashoffset: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 1,
            ease: 'power2.inOut',
          },
          '-=0.5'
        );

      // 4. AI Justice Core Animation (Section 4)
      gsap.to('.justice-orbital', {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
      });

      gsap.fromTo(
        '.scanner-line',
        { translateY: -100 },
        {
          translateY: 300,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        }
      );

      // Scroll-triggered Reveal Animations
      gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power3.out',
        });
      });

      // Premium GSAP Parallax Effect for Hero
      gsap.to('.hero-text-content', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('.animation-container', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Parallax on pricing cards
      gsap.from('.pricing-card', {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#pricing',
          start: 'top 70%',
        },
      });

      // Premium GSAP Active Section Tracking for Nav Pill
      const sections = ['home', 'how-it-works', 'about', 'ai-justice', 'pricing', 'faq'];
      sections.forEach((id) => {
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: 'top 40%',
          end: 'bottom 40%',
          onToggle: (self) => {
            if (self.isActive) setActiveSection(id);
          },
          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id),
        });
      });

      // Escrow Vault Animation
      gsap.to('.vault-inner', {
        scrollTrigger: {
          trigger: '.vault-section',
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
        },
        rotate: 360,
        scale: 1.1,
      });
    },
    { scope: containerRef }
  );

  const faqs = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
  ];

  const navLinks = [
    { name: t.nav.home, id: 'home' },
    { name: t.nav.howItWorks, id: 'how-it-works' },
    { name: t.nav.about, id: 'about' },
    { name: t.nav.aiJustice, id: 'ai-justice' },
    { name: t.nav.pricing, id: 'pricing' },
    { name: t.nav.faq, id: 'faq' },
  ];

  return (
    <div
      ref={containerRef}
      className={cn(
        'min-h-screen overflow-x-hidden font-sans transition-colors duration-500 selection:bg-blue-100',
        isDark ? 'dark bg-[#08111A] text-white' : 'bg-white text-[#0D1B2A]'
      )}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* 🟢 NAVIGATION - Apple-Inspired Interactive Nav */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed z-50 flex w-full items-center justify-between border-b border-white/10 bg-white/50 p-4 backdrop-blur-2xl md:px-12 dark:bg-[#0D1B2A]/50"
      >
        <Link
          to="/"
          className="flex items-center gap-3 text-2xl font-black tracking-tighter text-[#0D1B2A] transition-opacity hover:opacity-80 dark:text-white"
        >
          <div className="rounded-xl bg-[#0D1B2A] p-1.5 shadow-lg shadow-blue-900/20">
            <KafilMark className="text-white" size={24} />
          </div>
          كفيل
        </Link>

        <div className="relative hidden gap-1 rounded-full border border-white/20 bg-white/40 p-1.5 shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-md lg:flex dark:border-white/10 dark:bg-[#0D1B2A]/40">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <motion.a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
                  setActiveSection(link.id);
                }}
                className={`group relative rounded-full px-6 py-2 text-sm font-bold transition-all duration-300 ${isActive ? 'text-[#0D1B2A] dark:text-white' : 'text-gray-600 hover:text-[#0D1B2A] dark:text-gray-300 dark:hover:text-white'}`}
              >
                <span className="relative z-10">{link.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 rounded-full border border-black/5 bg-white shadow-sm dark:border-white/5 dark:bg-white/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {!isActive && (
                  <motion.span className="absolute inset-0 rounded-full bg-white/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-white/5" />
                )}
              </motion.a>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 text-gray-600 transition-colors hover:text-[#0D1B2A] dark:text-gray-300 dark:hover:text-white"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={toggleLang}
            className="mx-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-[#0D1B2A] dark:bg-white/10 dark:text-white"
          >
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
          <Link
            to="/login"
            className="rounded-full px-6 py-2.5 text-sm font-bold text-[#0D1B2A] transition-all hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
          >
            {t.nav.login}
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/register"
              className="block rounded-full bg-[#0D1B2A] px-8 py-3 text-sm font-bold text-white shadow-xl shadow-blue-900/10"
            >
              {t.nav.register}
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* 🚀 HERO SECTION - Cinematic SVG */}
      <section
        id="home"
        ref={heroRef}
        className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-white px-6 pt-40 pb-32 transition-colors duration-500 dark:bg-[#08111A] dark:bg-gradient-to-br dark:from-[#0D1B2A] dark:to-[#08111A]"
      >
        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div className="hero-text-content space-y-8 text-right">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-6 py-2 text-sm font-bold text-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.15)] backdrop-blur-sm transition-colors dark:border-blue-500/30 dark:bg-blue-900/40 dark:text-blue-300"
            >
              <Sparkles size={16} className="text-blue-500 transition-colors dark:text-blue-400" />{' '}
              {t.hero.badge}
            </motion.div>

            <h1
              ref={titleRef}
              className="mb-6 text-4xl leading-relaxed font-black tracking-widest text-[#0D1B2A] transition-colors md:text-6xl lg:text-7xl dark:text-white"
            >
              <div className="overflow-hidden">{t.hero.title1}</div>
              <div className="overflow-hidden bg-gradient-to-l from-[#C9A84C] via-[#8B7333] to-[#C9A84C] bg-clip-text py-2 text-transparent dark:via-[#E8DDD0]">
                {t.hero.title2}
              </div>
            </h1>

            <p className="hero-sub max-w-lg text-lg leading-relaxed font-medium text-gray-500 transition-colors dark:text-gray-400">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Link
                to="/register"
                className="hero-btn group flex items-center justify-center gap-3 rounded-full bg-[#C9A84C] px-10 py-4 text-lg font-black text-[#0D1B2A] shadow-[0_0_30px_rgba(201,168,76,0.3)] transition-all hover:bg-[#D4B55E] hover:shadow-[0_0_40px_rgba(201,168,76,0.5)]"
              >
                {t.hero.startBtn}{' '}
                <ArrowLeft
                  size={22}
                  className="transform transition-transform duration-300 group-hover:-translate-x-2"
                />
              </Link>
              <a
                href="#how-it-works"
                className="hero-btn flex items-center justify-center gap-2 rounded-full border border-black/10 bg-black/5 px-10 py-4 text-lg font-bold text-[#0D1B2A] backdrop-blur-md transition-all hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <KafilMark size={20} /> {t.hero.howItWorksBtn}
              </a>
            </div>

            <div className="mt-16 border-t border-black/10 pt-16 transition-colors dark:border-white/5">
              <div className="flex flex-wrap justify-end gap-8">
                {[
                  {
                    icon: Lock,
                    label: t.hero.features[0],
                    color: 'text-blue-500 dark:text-blue-400',
                    bg: 'bg-blue-50 dark:bg-blue-400/10',
                  },
                  {
                    icon: ShieldCheck,
                    label: t.hero.features[1],
                    color: 'text-green-500 dark:text-green-400',
                    bg: 'bg-green-50 dark:bg-green-400/10',
                  },
                  {
                    icon: UserCheck,
                    label: t.hero.features[2],
                    color: 'text-amber-500 dark:text-amber-400',
                    bg: 'bg-amber-50 dark:bg-amber-400/10',
                  },
                ].map((badge, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="group flex items-center gap-3 rounded-2xl border border-black/5 bg-black/5 px-5 py-3 backdrop-blur-md transition-all hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    <div
                      className={`rounded-xl p-2 ${badge.bg} ${badge.color} transition-transform group-hover:scale-110`}
                    >
                      <badge.icon size={20} />
                    </div>
                    <span className="text-sm font-bold text-gray-600 transition-colors group-hover:text-[#0D1B2A] dark:text-gray-400 dark:group-hover:text-white">
                      {badge.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Cinematic Animation Container */}
          <div
            className="animation-container relative flex h-[500px] w-full items-center justify-center lg:h-[600px]"
            dir="ltr"
          >
            <svg
              className="pointer-events-none absolute inset-0 z-0 h-full w-full"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 500 600"
            >
              <defs>
                <linearGradient id="gold-grad" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#C9A84C" stopOpacity="1"></stop>
                </linearGradient>
                <linearGradient id="teal-grad" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#1A7F74" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#1A7F74" stopOpacity="1"></stop>
                </linearGradient>
                <linearGradient id="blue-grad" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="1"></stop>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur result="coloredBlur" stdDeviation="4"></feGaussianBlur>
                  <feMerge>
                    <feMergeNode in="coloredBlur"></feMergeNode>
                    <feMergeNode in="SourceGraphic"></feMergeNode>
                  </feMerge>
                </filter>
              </defs>
              <path
                className="input-flow"
                style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
                d="M250 50 L250 180"
                fill="none"
                filter="url(#glow)"
                stroke="url(#gold-grad)"
                strokeWidth="3"
              ></path>
              <path
                className="output-flow-1"
                style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
                d="M250 380 Q250 450, 120 450 L120 500"
                fill="none"
                filter="url(#glow)"
                stroke="url(#teal-grad)"
                strokeWidth="3"
              ></path>
              <path
                className="output-flow-2"
                style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
                d="M250 380 Q250 450, 380 450 L380 500"
                fill="none"
                filter="url(#glow)"
                stroke="url(#blue-grad)"
                strokeWidth="3"
              ></path>
            </svg>

            <div className="source-node absolute top-10 z-10 flex flex-col items-center opacity-0">
              <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#22C55E] bg-[#22C55E]/20 text-[#22C55E] shadow-[0_0_20px_#22C55E]">
                <span className="text-3xl font-black">$</span>
              </div>
              <span className="font-bold text-[#22C55E]">$5,000</span>
            </div>

            <div className="escrow-vault relative z-20 flex w-72 scale-95 transform flex-col items-center justify-center rounded-[2rem] border border-gray-200 bg-white/80 p-8 text-center opacity-0 shadow-[0_0_40px_rgba(201,168,76,0.15)] backdrop-blur-md transition-colors dark:border-[#C9A84C]/30 dark:bg-[#0D1B2A]/60">
              <div className="vault-icon relative mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-[#C9A84C] bg-gray-50 transition-colors dark:bg-[#0D1B2A]">
                <Lock className="lock-icon h-12 w-12 text-[#C9A84C]" />
                <div className="vault-pulse absolute inset-0 rounded-full bg-[#C9A84C]/20"></div>
              </div>
              <span className="mb-2 text-xl font-black text-[#C9A84C]">{t.hero.escrowVault}</span>
              <span className="px-4 text-sm leading-snug text-gray-500 transition-colors dark:text-gray-400">
                {t.hero.escrowDesc}
              </span>
              <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="vault-progress h-full w-0 bg-[#C9A84C] shadow-[0_0_10px_#C9A84C]"></div>
              </div>
              <div className="outcome-text mt-4 flex flex-col items-center space-y-1 opacity-0">
                <span className="text-sm font-bold text-[#22C55E]">{t.hero.success}</span>
                <span className="text-[10px] tracking-tighter text-gray-400 uppercase transition-colors dark:text-white/40">
                  {t.hero.released}
                </span>
              </div>
            </div>

            <div className="absolute bottom-10 z-10 flex w-full justify-between px-4 sm:px-10">
              <div className="alloc-node-1 flex translate-y-10 transform flex-col items-center opacity-0">
                <div className="mb-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-[#1A7F74] bg-[#1A7F74]/10 text-[#1A7F74] shadow-[0_0_20px_#1A7F74] ring-4 ring-black/5 transition-colors dark:bg-[#1A7F74]/20 dark:ring-black/40">
                  <UserCheck className="h-8 w-8" />
                </div>
                <span className="text-sm font-bold text-gray-500 transition-colors dark:text-gray-400">
                  {t.hero.designer}
                </span>
                <span className="text-lg font-bold text-[#1A7F74]">$2,000</span>
              </div>
              <div className="alloc-node-2 flex translate-y-10 transform flex-col items-center opacity-0">
                <div className="mb-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-[#3B82F6] bg-[#3B82F6]/10 text-[#3B82F6] shadow-[0_0_20px_#3B82F6] ring-4 ring-black/5 transition-colors dark:bg-[#3B82F6]/20 dark:ring-black/40">
                  <BrainCircuit className="h-8 w-8" />
                </div>
                <span className="text-sm font-bold text-gray-500 transition-colors dark:text-gray-400">
                  {t.hero.developer}
                </span>
                <span className="text-lg font-bold text-[#3B82F6]">$3,000</span>
              </div>
            </div>

            <div className="success-overlay pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center opacity-0">
              <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full border-2 border-[#22C55E] bg-[#22C55E]/10 shadow-[0_0_100px_rgba(34,197,94,0.3)] backdrop-blur-md">
                <CheckCircle className="h-16 w-16 text-[#22C55E]" />
              </div>
              <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white/80 px-6 py-3 shadow-lg backdrop-blur-md transition-colors dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                <span className="mb-1 text-xs font-bold tracking-widest text-gray-500 uppercase transition-colors dark:text-white/60">
                  {t.hero.justiceRatio}
                </span>
                <span className="text-4xl font-black text-[#22C55E]">100%</span>
                <span className="mt-2 text-xs text-gray-600 transition-colors dark:text-white/80">
                  {t.hero.fairPricing}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔒 THE VAULT SECTION - Interactive Animation */}
      <section
        id="how-it-works"
        className="vault-section relative overflow-hidden bg-[#0D1B2A] py-40 text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent opacity-10"></div>
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-20 px-6 lg:flex-row">
          <div className="flex-1 text-right">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/20 px-5 py-2 text-sm font-black text-blue-400"
            >
              <Lock size={16} /> {t.vault.badge}
            </motion.div>
            <h2 className="mb-8 text-3xl leading-[1.2] font-black md:text-5xl">
              {t.vault.title1}
              <br />
              <span className="text-blue-400">{t.vault.title2}</span>
            </h2>
            <p className="mb-12 text-lg leading-relaxed text-gray-400">{t.vault.desc}</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                {
                  title: '{t.vault.f1_title}',
                  desc: '{t.vault.f1_desc}',
                  icon: Lock,
                  glow: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]',
                  bg: 'bg-blue-500/20',
                  text: 'text-blue-400',
                },
                {
                  title: '{t.vault.f2_title}',
                  desc: '{t.vault.f2_desc}',
                  icon: Zap,
                  glow: 'shadow-[0_0_20px_rgba(201,168,76,0.4)]',
                  bg: 'bg-amber-500/20',
                  text: 'text-amber-400',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="group flex items-center gap-4 rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:bg-white/15"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg} ${item.text} border border-white/10 ${item.glow} transition-transform duration-500 group-hover:scale-110`}
                  >
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h4 className="mb-0.5 text-lg font-bold text-white">{item.title}</h4>
                    <p className="text-sm font-medium text-gray-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative flex flex-1 justify-center">
            <div className="vault-inner relative flex h-72 w-72 items-center justify-center rounded-full border-[20px] border-blue-900/50 shadow-[0_0_100px_rgba(59,130,246,0.2)] md:h-96 md:w-96">
              <div className="absolute inset-4 animate-[spin_20s_linear_infinite] rounded-full border-4 border-dashed border-blue-400/30"></div>
              <div className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-indigo-900 shadow-2xl md:h-64 md:w-64">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <Fingerprint size={80} className="animate-pulse text-white" />
              </div>

              {/* Orbital Indicators */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="pointer-events-none absolute inset-[-40px]"
              >
                <div className="absolute top-0 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-blue-500 shadow-[0_0_20px_#3b82f6]"></div>
                <div className="absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-indigo-500 shadow-[0_0_20px_#6366f1]"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ❌ PROBLEM VS ✅ SOLUTION - Apple-Style Morph Narrative */}
      <section
        id="about"
        className="morph-bg relative min-h-screen bg-[#F9F4EE] transition-colors duration-1000 dark:bg-[#08111A]"
      >
        <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-6">
          <div className="relative z-30 mb-16 text-center">
            <motion.h2 className="morph-headline mb-6 text-4xl font-black tracking-tighter text-[#0D1B2A] md:text-6xl lg:text-[5rem] dark:text-white">
              من الفوضى... إلى اليقين.
            </motion.h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed font-medium text-gray-500 opacity-60 md:text-xl">
              اسحب للأسفل لترى كيف نحول المخاطر إلى ضمانات.
            </p>
          </div>

          <div className="relative flex h-[60vh] w-full max-w-7xl items-center justify-center">
            {/* 🌉 CINEMATIC SVG ASSEMBLY - Pinned Center */}
            <div
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
              dir="ltr"
            >
              <svg className="h-full w-full max-w-4xl" viewBox="0 0 800 500">
                <defs>
                  <filter id="gold-neon" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feFlood floodColor="#C9A84C" floodOpacity="0.6" />
                    <feComposite in2="blur" operator="in" />
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Circuit paths that assemble */}
                <g className="kafeel-assembly-container opacity-0">
                  <path
                    className="secure-circuit-path"
                    d="M100 250 Q200 100, 400 100 T700 250"
                    stroke="#C9A84C"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="1000"
                    strokeDashoffset="1000"
                    filter="url(#gold-neon)"
                  />
                  <path
                    className="secure-circuit-path"
                    d="M100 250 Q200 400, 400 400 T700 250"
                    stroke="#C9A84C"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="1000"
                    strokeDashoffset="1000"
                    filter="url(#gold-neon)"
                  />
                  <circle
                    cx="400"
                    cy="250"
                    r="100"
                    fill="none"
                    stroke="#C9A84C"
                    strokeWidth="1"
                    strokeDasharray="10 10"
                    className="animate-[spin_60s_linear_infinite]"
                  />
                  <Lock className="h-12 w-12 text-[#C9A84C]" x="375" y="225" />
                </g>
              </svg>
            </div>

            {/* Stage 1: Traditional Risk Card */}
            <motion.div className="traditional-card absolute z-20 w-full max-w-xl rounded-[3rem] border border-red-100 bg-white/80 p-12 shadow-2xl backdrop-blur-xl">
              <div className="mb-10 flex items-center gap-6 text-red-500">
                <div className="animate-pulse rounded-2xl bg-red-50 p-4">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-4xl font-black text-[#0D1B2A]">العمل التقليدي</h3>
              </div>
              <div className="space-y-6">
                {[
                  'ضياع الحقوق المالية بسبب غياب الضمان.',
                  'عمولات خفية وغير مبررة من الوسطاء.',
                  'نزاعات تستمر لشهور دون حل عادل.',
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-4 text-lg font-bold text-gray-500">
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-red-400" />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stage 2: Kafeel Secured Card (Reveals on Scroll) */}
            <motion.div className="kafeel-assembly-container absolute z-20 w-full max-w-xl scale-90 rounded-[3rem] border border-[#C9A84C]/30 bg-[#0D1B2A]/90 p-12 opacity-0 shadow-[0_0_100px_rgba(201,168,76,0.15)] backdrop-blur-2xl">
              <div className="mb-10 flex items-center gap-6 text-[#C9A84C]">
                <div className="rounded-2xl bg-[#C9A84C]/10 p-4 shadow-[0_0_20px_rgba(201,168,76,0.2)]">
                  <KafilMark size={32} />
                </div>
                <h3 className="text-4xl font-black text-white">مع كفيل</h3>
              </div>
              <div className="mb-12 space-y-6">
                {[
                  'أموالك في خزنة بنكية مستقلة حتى الاستلام.',
                  'شفافية مطلقة في كل معاملة وميزانية.',
                  'عدالة فورية مدعومة بالذكاء الاصطناعي.',
                ].map((text, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 text-lg font-bold text-blue-100/70"
                  >
                    <CheckCircle className="mt-1 shrink-0 text-[#C9A84C]" size={20} />
                    {text}
                  </div>
                ))}
              </div>
              <Link
                to="/register"
                className="block w-full rounded-2xl bg-[#C9A84C] py-6 text-center font-black text-[#0D1B2A] shadow-xl shadow-blue-950 transition-all hover:bg-[#D4B55E]"
              >
                ابدأ تجربتك الآمنة الآن
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🤖 AI JUSTICE - Cyberpunk Tech Aesthetic */}
      <section
        id="ai-justice"
        className="reveal-section relative overflow-hidden bg-white py-40 transition-colors duration-500 dark:bg-[#08111A]"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-24 px-6 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-10 -z-10 rounded-full bg-blue-100/50 blur-[80px]"></div>
            <motion.div
              initial={{ rotate: -5, scale: 0.9 }}
              whileInView={{ rotate: 0, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="overflow-hidden rounded-[3rem] border-8 border-gray-100 bg-white shadow-2xl transition-colors dark:border-white/5 dark:bg-[#0D1B2A]"
            >
              <div className="flex gap-3 border-b border-gray-800 bg-gray-900 p-6">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="mr-auto font-mono text-[10px] tracking-widest text-gray-500 uppercase">
                  ai-justice-engine.js
                </span>
              </div>
              <div className="space-y-6 p-8">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-colors dark:border-white/10 dark:bg-white/5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-black text-blue-600 uppercase dark:text-blue-400">
                      تحليل الميزانية
                    </span>
                    <span className="text-xs font-bold text-gray-400">ID: #8829</span>
                  </div>
                  <h4 className="mb-2 text-xl font-bold text-[#0D1B2A] dark:text-white">
                    تصميم تطبيق كامل (iOS)
                  </h4>
                  <p className="mb-4 text-2xl font-black text-[#0D1B2A] dark:text-white">$200.00</p>
                  <div className="flex items-start gap-4 rounded-xl border border-red-100 bg-red-50 p-4 transition-colors dark:border-red-500/20 dark:bg-red-500/10">
                    <AlertTriangle className="shrink-0 text-red-500" size={20} />
                    <p className="text-sm font-bold text-red-900 dark:text-red-300">
                      تحذير: السعر أقل من متوسط السوق بنسبة 70%. هذا السعر قد يعتبر مجحفاً للمستقل.
                    </p>
                  </div>
                </div>
                <div className="flex animate-pulse items-center gap-4 text-gray-400">
                  <BrainCircuit size={20} />
                  <span className="font-mono text-xs">الذكاء الاصطناعي يقوم بتحليل العقد...</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-5 py-2 text-sm font-black text-indigo-700 transition-colors dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
              <Zap size={16} /> مدعوم بـ GPT-4o
            </div>
            <h2 className="mb-8 text-3xl leading-[1.2] font-black tracking-tight text-[#0D1B2A] transition-colors md:text-5xl dark:text-white">
              مقـيم العدالة
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">كاشف الاستغلال.</span>
            </h2>
            <p className="mb-12 text-lg leading-relaxed font-medium text-gray-500">
              أول نظام ذكاء اصطناعي في المنطقة يراقب تسعير المهام بشكل آلي. إذا حاول أي طرف استغلال
              الآخر بميزانيات غير منطقية، يتدخل النظام فوراً لتقديم نصيحة سعرية عادلة بناءً على
              متوسطات السوق.
            </p>
            <div className="space-y-6">
              {[
                {
                  icon: Scale,
                  title: 'تحكيم فوري',
                  desc: 'في حال النزاع، يقوم الـ AI بتلخيص المشكلة واقتراح حل عادل في ثوانٍ.',
                },
                {
                  icon: Sparkles,
                  title: 'تحليل العقود',
                  desc: 'كشف الثغرات في وصف المشاريع قبل البدء لضمان وضوح المهام.',
                },
              ].map((item, i) => (
                <div key={i} className="group flex gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-white text-[#0D1B2A] shadow-sm transition-all duration-300 group-hover:bg-[#0D1B2A] group-hover:text-white dark:border-white/10 dark:bg-[#0D1B2A] dark:text-white dark:group-hover:bg-white dark:group-hover:text-[#0D1B2A]">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="mb-1 text-xl font-bold text-[#0D1B2A] dark:text-white">
                      {item.title}
                    </h4>
                    <p className="leading-relaxed text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 FINAL CTA - Apple Card Style */}
      <section className="reveal-section px-6 py-40">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[4rem] bg-gradient-to-br from-[#0D1B2A] via-[#16213e] to-[#0D1B2A] p-16 text-center shadow-2xl md:p-32"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px]"></div>

          <div className="relative z-10">
            <h2 className="mb-10 text-4xl leading-relaxed font-black tracking-widest text-white md:text-6xl lg:text-[4.5rem]">
              جاهز لتبني مستقبلك
              <br />
              بكل أمان؟
            </h2>
            <p className="mx-auto mb-16 max-w-2xl text-lg font-medium text-blue-200 opacity-80 md:text-xl">
              انضم إلى آلاف العملاء والمستقلين الذين اختاروا "كفيل" كشريك موثوق لرحلتهم في عالم
              العمل الحر.
            </p>
            <div className="flex flex-col items-center justify-center gap-8 sm:flex-row">
              <Link
                to="/register"
                className="w-full scale-110 rounded-3xl bg-white px-16 py-6 text-xl font-black text-[#0D1B2A] shadow-2xl transition-all hover:scale-115 hover:bg-gray-100 active:scale-105 sm:w-auto"
              >
                ابدأ رحلتك الآن
              </Link>
            </div>
            <div className="mt-20 flex flex-wrap items-center justify-center gap-6">
              {[
                {
                  icon: Lock,
                  label: 'مشفر بالكامل',
                  color: 'text-blue-400',
                  shadow: 'shadow-blue-500/40',
                },
                {
                  icon: ShieldCheck,
                  label: 'ضمان مالي',
                  color: 'text-green-400',
                  shadow: 'shadow-green-500/40',
                },
                {
                  icon: UserCheck,
                  label: 'هوية موثقة',
                  color: 'text-amber-400',
                  shadow: 'shadow-amber-500/40',
                },
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                  className="group flex cursor-default items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-7 py-3.5 shadow-[0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-xl transition-all"
                >
                  <badge.icon
                    className={`${badge.color} drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] filter transition-transform duration-500 group-hover:scale-125`}
                    size={20}
                  />
                  <span className="text-sm font-black tracking-widest text-white uppercase drop-shadow-sm transition-colors">
                    {badge.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* 💰 PRICING SECTION */}
      <section
        id="pricing"
        className="bg-white px-6 py-32 transition-colors duration-500 md:px-12 dark:bg-[#08111A]"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <span className="mb-6 inline-block rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/10 px-5 py-2 text-xs font-black tracking-widest text-[#C9A84C] uppercase dark:bg-[#C9A84C]/5">
              الأسعار والخطط
            </span>
            <h2 className="mb-6 text-5xl font-black tracking-tight text-[#0D1B2A] transition-colors md:text-6xl dark:text-white">
              ادفع فقط عند <span className="text-[#C9A84C]">نجاح مشروعك</span>
            </h2>
            <p className="mx-auto max-w-2xl text-xl font-medium text-gray-500 transition-colors dark:text-gray-400">
              لا عمولات خفية. لا مفاجآت. خطط واضحة تناسب كل حجم من أحجام الأعمال.
            </p>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-4">
            {/* Basic */}
            <motion.div className="pricing-card group relative flex flex-col rounded-3xl border-2 border-gray-100 bg-white p-8 transition-colors hover:border-gray-200 hover:shadow-xl dark:border-white/5 dark:bg-[#0D1B2A] dark:hover:border-white/10">
              <div className="mb-8">
                <span className="text-xs font-black tracking-widest text-gray-400 uppercase dark:text-gray-500">
                  Basic
                </span>
                <h3 className="mt-2 mb-1 text-2xl font-black text-[#0D1B2A] transition-colors dark:text-white">
                  مجاني
                </h3>
                <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
                  للأفراد يبدأون رحلتهم
                </p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-5xl font-black text-[#0D1B2A] transition-colors dark:text-white">
                    $0
                  </span>
                  <span className="mb-2 font-medium text-gray-400">/شهر</span>
                </div>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                {[
                  '✅ مشروع واحد نشط في كل وقت',
                  '✅ مستقل واحد فقط لكل مهمة',
                  '✅ خزنة Escrow مدمجة',
                  '✅ نظام التسليم الموثق',
                  '❌ لا تحكيم مجتمعي',
                  '❌ لا تقارير مالية',
                ].map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    {f}
                  </li>
                ))}
              </ul>
              <motion.a
                href="/register"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full rounded-2xl border-2 border-gray-200 py-3.5 text-center text-sm font-bold text-[#0D1B2A] transition-all hover:bg-gray-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
              >
                ابدأ مجاناً
              </motion.a>
            </motion.div>

            {/* Pro */}
            <motion.div className="pricing-card relative flex flex-col rounded-3xl border-2 border-gray-100 bg-white p-8 transition-colors hover:border-blue-200 hover:shadow-xl dark:border-white/5 dark:bg-[#0D1B2A] dark:hover:border-blue-500/20">
              <div className="mb-8">
                <span className="text-xs font-black tracking-widest text-blue-500 uppercase">
                  Pro
                </span>
                <h3 className="mt-2 mb-1 text-2xl font-black text-[#0D1B2A] transition-colors dark:text-white">
                  المحترف
                </h3>
                <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
                  للمشاريع المتعددة والفرق الصغيرة
                </p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-5xl font-black text-[#0D1B2A] transition-colors dark:text-white">
                    $29
                  </span>
                  <span className="mb-2 font-medium text-gray-400">/شهر</span>
                </div>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                {[
                  '✅ حتى 15 مشروعاً نشطاً',
                  '✅ حتى 6 مستقلين لكل مشروع',
                  '✅ خزنة Escrow مدمجة',
                  '✅ التحكيم المجتمعي للنزاعات',
                  '✅ تقارير مالية أساسية',
                  '✅ إشعارات بريد إلكتروني',
                  '❌ منسق مخصص',
                ].map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    {f}
                  </li>
                ))}
              </ul>
              <motion.a
                href="/register"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full rounded-2xl border-2 border-blue-500 py-3.5 text-center text-sm font-bold text-blue-600 transition-all hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
              >
                ابدأ تجربة 14 يوم
              </motion.a>
            </motion.div>

            {/* Premium — MOST POPULAR */}
            <motion.div className="pricing-card relative flex scale-[1.02] flex-col rounded-3xl border-2 border-[#C9A84C] bg-[#0D1B2A] p-8 shadow-2xl shadow-[#C9A84C]/20 dark:bg-[#C9A84C]/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-[#C9A84C] px-4 py-1.5 text-[10px] font-black tracking-widest whitespace-nowrap text-[#0D1B2A] uppercase shadow-lg">
                  ⭐ الأكثر شيوعاً
                </span>
              </div>
              <div className="mb-8">
                <span className="text-xs font-black tracking-widest text-[#C9A84C] uppercase">
                  Premium
                </span>
                <h3 className="mt-2 mb-1 text-2xl font-black text-white">المتميز</h3>
                <p className="text-sm font-medium text-white/50">للشركات التي تتوسع بثقة</p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-5xl font-black text-white">$79</span>
                  <span className="mb-2 font-medium text-white/50">/شهر</span>
                </div>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                {[
                  '✅ مشاريع ومستقلين بلا حدود',
                  '✅ تحكيم ذو أولوية قصوى',
                  '✅ منسق مشاريع مخصص',
                  '✅ لوحة تحليلات متقدمة',
                  '✅ تقارير PDF تلقائية',
                  '✅ API للتكامل مع أنظمتك',
                  '✅ دعم أولوية 24/7',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-medium text-white/80">
                    {f}
                  </li>
                ))}
              </ul>
              <motion.a
                href="/register"
                whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(201,168,76,0.5)' }}
                whileTap={{ scale: 0.98 }}
                className="block w-full rounded-2xl bg-[#C9A84C] py-3.5 text-center text-sm font-black text-[#0D1B2A] transition-all"
              >
                ابدأ تجربة 14 يوم
              </motion.a>
            </motion.div>

            {/* Enterprise */}
            <motion.div className="pricing-card relative flex flex-col rounded-3xl border-2 border-gray-100 bg-white p-8 transition-colors hover:border-purple-200 hover:shadow-xl dark:border-white/5 dark:bg-[#0D1B2A] dark:hover:border-purple-500/20">
              <div className="mb-8">
                <span className="text-xs font-black tracking-widest text-purple-500 uppercase">
                  Enterprise
                </span>
                <h3 className="mt-2 mb-1 text-2xl font-black text-[#0D1B2A] transition-colors dark:text-white">
                  المؤسسات
                </h3>
                <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
                  حلول مخصصة لفرق الأعمال الكبيرة
                </p>
                <div className="mt-6">
                  <span className="text-3xl font-black text-[#0D1B2A] transition-colors dark:text-white">
                    تواصل معنا
                  </span>
                </div>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                {[
                  '✅ كل ما في Premium',
                  '✅ SLA مضمون 99.9% uptime',
                  '✅ بيئة منفصلة (Private Instance)',
                  '✅ تكامل مع SAP / ERP',
                  '✅ فريق دعم مخصص',
                  '✅ تدريب الفريق',
                  '✅ عقد مخصص وفاتورة شهرية',
                ].map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    {f}
                  </li>
                ))}
              </ul>
              <motion.a
                href="mailto:enterprise@kafil.sa"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full rounded-2xl bg-[#0D1B2A] py-3.5 text-center text-sm font-bold text-white transition-all hover:opacity-90 dark:bg-white dark:text-[#0D1B2A]"
              >
                تواصل مع فريق المبيعات
              </motion.a>
            </motion.div>
          </div>

          {/* Bottom note */}
          <p className="mt-12 text-center text-sm font-medium text-gray-400 transition-colors dark:text-gray-500">
            جميع الخطط تشمل خزنة Escrow مدمجة وحماية مالية كاملة للعملاء والمستقلين. العمولة على
            المعاملات <span className="font-black text-[#0D1B2A] dark:text-white">5%</span> فقط.
          </p>
        </div>
      </section>

      {/* ❓ FAQ SECTION */}
      <section
        id="faq"
        className="reveal-section bg-gray-50/30 py-32 transition-colors duration-500 dark:bg-[#0a1622]"
      >
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black tracking-tight text-[#0D1B2A] transition-colors dark:text-white">
              الأسئلة الشائعة
            </h2>
            <p className="font-bold text-gray-500 transition-colors dark:text-gray-400">
              كل ما تحتاج معرفته عن نظام كفيل والضمان المالي.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white transition-all hover:shadow-md dark:border-white/5 dark:bg-[#0D1B2A]"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-6 text-right"
                >
                  <span className="text-lg font-bold text-[#0D1B2A] dark:text-white">{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      'text-gray-400 transition-transform dark:text-gray-500',
                      openFaq === i && 'rotate-180'
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-50 p-6 pt-0 leading-relaxed font-medium text-gray-500 transition-colors dark:border-white/5 dark:text-gray-400">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏁 FOOTER - Minimalist Apple Style */}
      <footer className="border-t border-gray-100 bg-white px-6 pt-32 pb-16 transition-colors duration-500 md:px-12 dark:border-white/5 dark:bg-[#08111A]">
        <div className="mx-auto mb-24 grid max-w-7xl gap-20 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-8 flex items-center gap-4 text-3xl font-black text-[#0D1B2A] transition-colors dark:text-white">
              <div className="rounded-2xl bg-[#0D1B2A] p-2 transition-colors dark:bg-white">
                <ShieldCheck
                  className="text-white transition-colors dark:text-[#0D1B2A]"
                  size={28}
                />
              </div>
              كفيل
            </div>
            <p className="max-w-md text-xl leading-relaxed font-medium text-gray-500 transition-colors dark:text-gray-400">
              كفيل هو المعيار الجديد للأمان في العمل الحر. بنينا نظاماً يضمن حق الجميع، ويحول دون أي
              محاولة للاستغلال المالي.
            </p>
          </div>
          <div>
            <h4 className="mb-8 text-lg font-black text-[#0D1B2A] transition-colors dark:text-white">
              المنصة
            </h4>
            <ul className="space-y-4 font-bold text-gray-500 transition-colors dark:text-gray-400">
              <li>
                <a href="#about" className="transition-colors hover:text-blue-600">
                  عن كفيل
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="transition-colors hover:text-blue-600">
                  نظام الضمان
                </a>
              </li>
              <li>
                <a href="#ai-justice" className="transition-colors hover:text-blue-600">
                  مقـيم العدالة
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  الأسعار والخطط
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  الأسئلة الشائعة
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-8 text-lg font-black text-[#0D1B2A] transition-colors dark:text-white">
              قانوني
            </h4>
            <ul className="space-y-4 font-bold text-gray-500 transition-colors dark:text-gray-400">
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  الشروط والأحكام
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  سياسة الخصوصية
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  قواعد التحكيم
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mb-12 hidden justify-center gap-10 text-sm font-bold text-gray-500 lg:flex">
          {[
            { name: 'الرئيسية', id: 'home' },
            { name: 'من نحن', id: 'about' },
            { name: 'كيفية العمل', id: 'how-it-works' },
            { name: 'الذكاء الاصطناعي', id: 'ai-justice' },
            { name: 'الأسعار والخطط', id: 'pricing' },
            { name: 'الأسئلة الشائعة', id: 'faq' },
          ].map((item, i) => (
            <motion.a
              key={i}
              href={`#${item.id}`}
              whileHover={{ y: -2, color: isDark ? '#fff' : '#0D1B2A' }}
              className="group relative transition-colors hover:text-blue-900 dark:hover:text-white"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#C9A84C] transition-all group-hover:w-full"></span>
            </motion.a>
          ))}
        </div>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between border-t border-gray-100 pt-12 text-sm font-bold text-gray-400 transition-colors md:flex-row dark:border-white/5 dark:text-gray-500">
          <p>© {new Date().getFullYear()} كفيل - Kafeel. كل الحقوق محفوظة.</p>
          <div className="mt-6 flex gap-10 md:mt-0">
            {['Twitter (X)', 'LinkedIn', 'Instagram'].map((social) => (
              <motion.a
                key={social}
                href="#"
                whileHover={{ scale: 1.1, color: isDark ? '#fff' : '#0D1B2A' }}
                className="transition-colors hover:text-[#0D1B2A] dark:hover:text-white"
              >
                {social}
              </motion.a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
