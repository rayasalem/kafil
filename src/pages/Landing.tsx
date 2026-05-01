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
  Sun
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { cn } from '@/shared/utils/cn';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(false);

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
  useGSAP(() => {
    // Hero Text Animation
    const heroTl = gsap.timeline();
    
    heroTl.from(".char", {
      opacity: 0,
      y: 100,
      rotateX: -90,
      stagger: 0.02,
      duration: 1,
      ease: "expo.out",
    })
    .from(".hero-sub", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.5")
    .from(".hero-btn", {
      opacity: 0,
      scale: 0.8,
      stagger: 0.1,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.4");

    // Hero Vault Cinematic Animation
    const vaultTl = gsap.timeline({
      repeat: -1,
      repeatDelay: 3
    });

    vaultTl.to(".escrow-vault", { opacity: 1, scale: 1, duration: 1.2, ease: "power4.out" })
      .to(".source-node", { opacity: 1, y: 20, duration: 0.8, ease: "back.out(1.7)" }, "-=0.7")
      .to(".input-flow", { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" })
      .to(".source-node", { opacity: 0, scale: 0.8, duration: 0.5 }, "-=0.3")
      .to(".vault-progress", { width: "100%", duration: 2, ease: "power2.inOut" })
      .to(".vault-pulse", { scale: 1.6, opacity: 0, duration: 1, repeat: 1, yoyo: true }, "-=1.8")
      .to(".escrow-vault", { boxShadow: "0 0 60px rgba(201, 168, 76, 0.4)", duration: 0.6 }, "-=0.6")
      .to(".output-flow-1, .output-flow-2", { strokeDashoffset: 0, duration: 1.5, ease: "power3.inOut", stagger: 0.15 })
      .to(".alloc-node-1, .alloc-node-2", { opacity: 1, y: 0, duration: 1, ease: "back.out(1.2)", stagger: 0.3 }, "-=1")
      .to(".outcome-text", { opacity: 1, y: -5, duration: 0.5 }, "-=0.5")
      .to(".success-overlay", { opacity: 1, scale: 1, duration: 0.8, ease: "power4.out" }, "-=0.2")
      .to(".escrow-vault, .alloc-node-1, .alloc-node-2", { opacity: 0.3, filter: "blur(4px)", duration: 0.8 }, "-=0.8");

    vaultTl.to({}, { duration: 3 })
      .to(".success-overlay, .escrow-vault, .alloc-node-1, .alloc-node-2, .outcome-text", { opacity: 0, duration: 0.8 })
      .set(".input-flow, .output-flow-1, .output-flow-2", { strokeDashoffset: 1000 })
      .set(".source-node", { opacity: 0, y: 0, scale: 1 })
      .set(".vault-progress", { width: "0%" })
      .set(".escrow-vault", { scale: 0.95, boxShadow: "0 0 40px rgba(201, 168, 76, 0.15)", filter: "blur(0px)" })
      .set(".alloc-node-1, .alloc-node-2", { y: 40 });

    // Apple-Style Morph Narrative (Section 3) - Maximum Snappiness
    const morphTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#about",
        start: "top top",
        end: "+=120%", // Tightened to prevent dead scroll
        scrub: 0.8,    // Slightly smoother scrub for better feel
        pin: true,
        anticipatePin: 1,
      }
    });

    morphTl
      // 1. Rapidly clear the old state
      .to(".traditional-card", { 
        x: -100, 
        opacity: 0, 
        scale: 0.85, 
        filter: "blur(15px)", 
        duration: 0.8 
      })
      .to(".morph-bg", { backgroundColor: "#0D1B2A", duration: 0.8 }, 0)
      .to(".morph-headline", { color: "#FFFFFF", duration: 0.8 }, 0)
      
      // 2. Reveal the new state immediately after
      .fromTo(".kafeel-assembly-container", 
        { scale: 0.9, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.4"
      )
      
      // 3. Final touch of security activation
      .to(".secure-circuit-path", {
        strokeDashoffset: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 1,
        ease: "power2.inOut"
      }, "-=0.5");

    // 4. AI Justice Core Animation (Section 4)
    gsap.to(".justice-orbital", {
      rotate: 360,
      duration: 20,
      repeat: -1,
      ease: "none"
    });

    gsap.fromTo(".scanner-line", 
      { translateY: -100 },
      { 
        translateY: 300, 
        duration: 3, 
        repeat: -1, 
        yoyo: true, 
        ease: "power1.inOut" 
      }
    );

    // Scroll-triggered Reveal Animations
    gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((section) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      });
    });

    // Escrow Vault Animation
    gsap.to(".vault-inner", {
      scrollTrigger: {
        trigger: ".vault-section",
        start: "top center",
        end: "bottom center",
        scrub: 1,
      },
      rotate: 360,
      scale: 1.1,
    });

  }, { scope: containerRef });

  const faqs = [
    { q: "ما هو نظام الضمان المالي (Escrow)؟", a: "في كفيل، يقوم العميل بإيداع ميزانية المشروع كاملة لدينا في البداية. نحتفظ بها بشكل آمن، ولا نفرج عنها للمستقل إلا بعد إنجاز المهام المتفق عليها. هذا يضمن حق العميل في الاستلام وحق المستقل بالدفع." },
    { q: "ماذا لو حصل خلاف بيني وبين العميل؟", a: "نظام كفيل يحتوي على آلية لحل النزاعات. الذكاء الاصطناعي يقوم بتحليل سجل المحادثات وتحديد نسبة الإنجاز والتقصير، وتقديم مقترح عادل لتقسيم الميزانية لضمان حقوق الطرفين." },
    { q: "كيف يعمل مقيم العدالة (كاشف العدالة)؟", a: "أثناء تسعير المهام، يقوم نظام الذكاء الاصطناعي الخاص بنا بمقارنة المبالغ المعروضة مع متوسط أجور السوق الإقليمية للمستقلين. إذا كان المبلغ مجحفاً، يظهر تحذير للمدير وللمستقل قبل قبول العمل لضمان الإنصاف." },
    { q: "هل هناك رسوم إضافية لاستخدام العقد الذكي/الضمان؟", a: "يتم خصم نسبة بسيطة فقط عند نجاح المهمة واستلام المستقل لمستحقاته كرسوم لتشغيل النظام الآمن وتغطية تكاليف بوابات الدفع، دون أي رسوم مخفية." }
  ];

  const navLinks = [
    { name: 'الرئيسية', id: 'home' },
    { name: 'كيفية العمل', id: 'how-it-works' },
    { name: 'من نحن', id: 'about' },
    { name: 'الذكاء الاصطناعي', id: 'ai-justice' },
    { name: 'الأسئلة الشائعة', id: 'faq' },
  ];

  return (
    <div ref={containerRef} className={cn("min-h-screen font-sans selection:bg-blue-100 overflow-x-hidden transition-colors duration-500", isDark ? "dark bg-[#08111A] text-white" : "bg-white text-[#0D1B2A]")} dir="rtl">
      
      {/* 🟢 NAVIGATION - Apple-Inspired Interactive Nav */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed w-full flex justify-between items-center p-4 md:px-12 z-50 bg-white/50 dark:bg-[#0D1B2A]/50 backdrop-blur-2xl border-b border-white/10"
      >
        <Link to="/" className="text-2xl font-black text-[#0D1B2A] dark:text-white flex items-center gap-3 tracking-tighter hover:opacity-80 transition-opacity">
          <div className="bg-[#0D1B2A] p-1.5 rounded-xl shadow-lg shadow-blue-900/20">
            <ShieldCheck className="text-white" size={24}/>
          </div>
          كفيل
        </Link>

        <div className="hidden lg:flex gap-1 p-1.5 bg-white/40 backdrop-blur-md rounded-full border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
          {navLinks.map((link, i) => (
            <motion.a 
              key={link.id}
              href={`#${link.id}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 rounded-full text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-[#0D1B2A] dark:hover:text-white transition-all duration-300 relative group"
            >
              <span className="relative z-10">{link.name}</span>
              <motion.span 
                className="absolute inset-0 bg-white/80 rounded-full -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm"
              />
            </motion.a>
          ))}
        </div>

        <div className="flex gap-4 items-center">
          <button onClick={() => setIsDark(!isDark)} className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#0D1B2A] dark:hover:text-white transition-colors">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/login" className="text-[#0D1B2A] dark:text-white font-bold px-6 py-2.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-all text-sm">دخول</Link>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/register" className="bg-[#0D1B2A] text-white font-bold px-8 py-3 rounded-full shadow-xl shadow-blue-900/10 text-sm block">
              إنشاء حساب
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* 🚀 HERO SECTION - Cinematic SVG */}
      <section id="home" ref={heroRef} className="relative pt-40 pb-32 px-6 overflow-hidden min-h-[90vh] flex flex-col items-center justify-center bg-white dark:bg-[#08111A] dark:bg-gradient-to-br dark:from-[#0D1B2A] dark:to-[#08111A] transition-colors duration-500">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
          <div className="space-y-8 text-right hero-text-content">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-bold px-6 py-2 rounded-full text-sm border border-blue-200 dark:border-blue-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-colors"
            >
              <Sparkles size={16} className="text-blue-500 dark:text-blue-400 transition-colors" /> معيار جديد للعمل الحر في الشرق الأوسط
            </motion.div>

            <h1 ref={titleRef} className="text-4xl md:text-6xl lg:text-7xl font-black text-[#0D1B2A] dark:text-white mb-6 leading-relaxed tracking-widest transition-colors">
              <div className="overflow-hidden">
                احمِ أموالك.
              </div>
              <div className="overflow-hidden text-transparent bg-clip-text bg-gradient-to-l from-[#C9A84C] via-[#8B7333] dark:via-[#E8DDD0] to-[#C9A84C] py-2">
                وضمان حقوقك.
              </div>
            </h1>
            
            <p className="hero-sub text-lg text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed font-medium transition-colors">
              نظام ضمان احترافي (Escrow) مصمم خصيصاً للمستقلين العرب. نحول مجهودك الإبداعي إلى تعويض مضمون.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register" className="hero-btn bg-[#C9A84C] text-[#0D1B2A] font-black px-10 py-4 rounded-full hover:bg-[#D4B55E] transition-all shadow-[0_0_30px_rgba(201,168,76,0.3)] hover:shadow-[0_0_40px_rgba(201,168,76,0.5)] flex items-center justify-center gap-3 text-lg group">
                ابدأ الآن <ArrowLeft size={22} className="transform group-hover:-translate-x-2 transition-transform duration-300"/>
              </Link>
              <a href="#how-it-works" className="hero-btn bg-black/5 dark:bg-white/5 backdrop-blur-md text-[#0D1B2A] dark:text-white font-bold px-10 py-4 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all border border-black/10 dark:border-white/10 text-lg flex items-center justify-center gap-2">
                <ShieldCheck size={20}/> كيف يعمل النظام
              </a>
            </div>

            <div className="pt-16 border-t border-black/10 dark:border-white/5 mt-16 transition-colors">
               <div className="flex flex-wrap gap-8 justify-end">
                 {[
                   { icon: Lock, label: "تشفير عسكري", color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-400/10" },
                   { icon: ShieldCheck, label: "ضمان مالي 100%", color: "text-green-500 dark:text-green-400", bg: "bg-green-50 dark:bg-green-400/10" },
                   { icon: UserCheck, label: "هوية موثقة", color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-400/10" }
                 ].map((badge, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.8 + i * 0.1 }}
                     className="flex items-center gap-3 bg-black/5 dark:bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-black/5 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-all group"
                   >
                     <div className={`p-2 rounded-xl ${badge.bg} ${badge.color} group-hover:scale-110 transition-transform`}>
                        <badge.icon size={20} />
                     </div>
                     <span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-[#0D1B2A] dark:group-hover:text-white transition-colors">{badge.label}</span>
                   </motion.div>
                 ))}
               </div>
            </div>
          </div>

          {/* Cinematic Animation Container */}
          <div className="relative h-[500px] lg:h-[600px] w-full flex items-center justify-center animation-container" dir="ltr">
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="xMidYMid meet" viewBox="0 0 500 600">
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
              <path className="input-flow" style={{strokeDasharray: 1000, strokeDashoffset: 1000}} d="M250 50 L250 180" fill="none" filter="url(#glow)" stroke="url(#gold-grad)" strokeWidth="3"></path>
              <path className="output-flow-1" style={{strokeDasharray: 1000, strokeDashoffset: 1000}} d="M250 380 Q250 450, 120 450 L120 500" fill="none" filter="url(#glow)" stroke="url(#teal-grad)" strokeWidth="3"></path>
              <path className="output-flow-2" style={{strokeDasharray: 1000, strokeDashoffset: 1000}} d="M250 380 Q250 450, 380 450 L380 500" fill="none" filter="url(#glow)" stroke="url(#blue-grad)" strokeWidth="3"></path>
            </svg>

            <div className="source-node absolute top-10 flex flex-col items-center opacity-0 z-10">
              <div className="w-16 h-16 rounded-full bg-[#22C55E]/20 border-2 border-[#22C55E] flex items-center justify-center shadow-[0_0_20px_#22C55E] text-[#22C55E] mb-2">
                <span className="text-3xl font-black">$</span>
              </div>
              <span className="font-bold text-[#22C55E]">$5,000</span>
            </div>

            <div className="escrow-vault bg-white/80 dark:bg-[#0D1B2A]/60 backdrop-blur-md rounded-[2rem] p-8 w-72 shadow-[0_0_40px_rgba(201,168,76,0.15)] relative z-20 border border-gray-200 dark:border-[#C9A84C]/30 opacity-0 transform scale-95 flex flex-col items-center justify-center text-center transition-colors">
              <div className="vault-icon w-24 h-24 rounded-full bg-gray-50 dark:bg-[#0D1B2A] border-2 border-[#C9A84C] flex items-center justify-center mb-6 relative overflow-hidden transition-colors">
                <Lock className="text-[#C9A84C] w-12 h-12 lock-icon" />
                <div className="absolute inset-0 bg-[#C9A84C]/20 vault-pulse rounded-full"></div>
              </div>
              <span className="font-black text-[#C9A84C] text-xl mb-2">خزنة الضمان (Escrow)</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 px-4 leading-snug transition-colors">بيئة آمنة تضمن حقوق الطرفين.</span>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
                <div className="vault-progress h-full bg-[#C9A84C] w-0 shadow-[0_0_10px_#C9A84C]"></div>
              </div>
              <div className="mt-4 flex flex-col items-center space-y-1 opacity-0 outcome-text">
                <span className="font-bold text-[#22C55E] text-sm">تم الإنجاز</span>
                <span className="text-[10px] text-gray-400 dark:text-white/40 uppercase tracking-tighter transition-colors">تم تحرير الدفعات بنجاح</span>
              </div>
            </div>

            <div className="absolute bottom-10 w-full flex justify-between px-4 sm:px-10 z-10">
              <div className="alloc-node-1 flex flex-col items-center opacity-0 transform translate-y-10">
                <div className="w-16 h-16 rounded-full bg-[#1A7F74]/10 dark:bg-[#1A7F74]/20 border-2 border-[#1A7F74] flex items-center justify-center shadow-[0_0_20px_#1A7F74] text-[#1A7F74] mb-2 overflow-hidden ring-4 ring-black/5 dark:ring-black/40 transition-colors">
                  <UserCheck className="w-8 h-8" />
                </div>
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 transition-colors">المصمم</span>
                <span className="font-bold text-[#1A7F74] text-lg">$2,000</span>
              </div>
              <div className="alloc-node-2 flex flex-col items-center opacity-0 transform translate-y-10">
                <div className="w-16 h-16 rounded-full bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 border-2 border-[#3B82F6] flex items-center justify-center shadow-[0_0_20px_#3B82F6] text-[#3B82F6] mb-2 overflow-hidden ring-4 ring-black/5 dark:ring-black/40 transition-colors">
                  <BrainCircuit className="w-8 h-8" />
                </div>
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 transition-colors">المطور</span>
                <span className="font-bold text-[#3B82F6] text-lg">$3,000</span>
              </div>
            </div>

            <div className="success-overlay absolute inset-0 flex flex-col items-center justify-center opacity-0 pointer-events-none z-30">
              <div className="w-32 h-32 rounded-full bg-[#22C55E]/10 border-2 border-[#22C55E] flex items-center justify-center shadow-[0_0_100px_rgba(34,197,94,0.3)] backdrop-blur-md mb-6">
                <CheckCircle className="text-[#22C55E] w-16 h-16" />
              </div>
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-gray-200 dark:border-white/10 flex flex-col items-center shadow-lg dark:shadow-none transition-colors">
                <span className="text-xs uppercase tracking-widest text-gray-500 dark:text-white/60 mb-1 font-bold transition-colors">نسبة العدالة</span>
                <span className="text-4xl font-black text-[#22C55E]">100%</span>
                <span className="text-xs text-gray-600 dark:text-white/80 mt-2 transition-colors">تسعير عادل للمنطقة</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔒 THE VAULT SECTION - Interactive Animation */}
      <section id="how-it-works" className="vault-section py-40 bg-[#0D1B2A] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 text-right">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 font-black px-5 py-2 rounded-full text-sm mb-8 border border-blue-500/30"
            >
              <Lock size={16} /> حماية مطلقة للأموال
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-[1.2]">
              خزنة كفيل الرقمية<br />
              <span className="text-blue-400">حيث تنام أموالك بسلام.</span>
            </h2>
            <p className="text-lg text-gray-400 mb-12 leading-relaxed">
              عندما تودع ميزانية المشروع، لا تذهب لجيوبنا ولا لجيوب المستقل مباشرة. هي تظل في حساب بنكي مشفر ومؤمن، ولا يتم تحريرها إلا عندما تضغط أنت على "استلام العمل".
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { 
                  title: 'تشفير AES-256', 
                  desc: 'تشفير كامل لبياناتك المالية.',
                  icon: Lock,
                  glow: "shadow-[0_0_20px_rgba(59,130,246,0.4)]",
                  bg: "bg-blue-500/20",
                  text: "text-blue-400"
                },
                { 
                  title: 'تحرير ذكي', 
                  desc: 'صرف آلي بناءً على الإنجاز.',
                  icon: Zap,
                  glow: "shadow-[0_0_20px_rgba(201,168,76,0.4)]",
                  bg: "bg-amber-500/20",
                  text: "text-amber-400"
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 flex items-center gap-4 group transition-all duration-300 hover:bg-white/15"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.bg} ${item.text} border border-white/10 ${item.glow} group-hover:scale-110 transition-transform duration-500`}>
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white mb-0.5">{item.title}</h4>
                    <p className="text-gray-400 text-sm font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 flex justify-center relative">
            <div className="vault-inner w-72 h-72 md:w-96 md:h-96 rounded-full border-[20px] border-blue-900/50 flex items-center justify-center relative shadow-[0_0_100px_rgba(59,130,246,0.2)]">
               <div className="absolute inset-4 rounded-full border-4 border-dashed border-blue-400/30 animate-[spin_20s_linear_infinite]"></div>
               <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                  <Fingerprint size={80} className="text-white animate-pulse" />
               </div>
               
               {/* Orbital Indicators */}
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-[-40px] pointer-events-none"
               >
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-blue-500 w-4 h-4 rounded-full shadow-[0_0_20px_#3b82f6]"></div>
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-indigo-500 w-4 h-4 rounded-full shadow-[0_0_20px_#6366f1]"></div>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ❌ PROBLEM VS ✅ SOLUTION - Apple-Style Morph Narrative */}
      <section id="about" className="relative min-h-screen bg-[#F9F4EE] dark:bg-[#08111A] morph-bg transition-colors duration-1000">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-6">
          
          <div className="text-center mb-16 relative z-30">
            <motion.h2 className="morph-headline text-4xl md:text-6xl lg:text-[5rem] font-black text-[#0D1B2A] dark:text-white mb-6 tracking-tighter">
              من الفوضى... إلى اليقين.
            </motion.h2>
            <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed opacity-60">
               اسحب للأسفل لترى كيف نحول المخاطر إلى ضمانات.
            </p>
          </div>

          <div className="relative w-full max-w-7xl h-[60vh] flex items-center justify-center">
            
            {/* 🌉 CINEMATIC SVG ASSEMBLY - Pinned Center */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none" dir="ltr">
              <svg className="w-full h-full max-w-4xl" viewBox="0 0 800 500">
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
                  <path className="secure-circuit-path" d="M100 250 Q200 100, 400 100 T700 250" stroke="#C9A84C" strokeWidth="2" fill="none" strokeDasharray="1000" strokeDashoffset="1000" filter="url(#gold-neon)" />
                  <path className="secure-circuit-path" d="M100 250 Q200 400, 400 400 T700 250" stroke="#C9A84C" strokeWidth="2" fill="none" strokeDasharray="1000" strokeDashoffset="1000" filter="url(#gold-neon)" />
                  <circle cx="400" cy="250" r="100" fill="none" stroke="#C9A84C" strokeWidth="1" strokeDasharray="10 10" className="animate-[spin_60s_linear_infinite]" />
                  <Lock className="text-[#C9A84C] w-12 h-12" x="375" y="225" />
                </g>
              </svg>
            </div>

            {/* Stage 1: Traditional Risk Card */}
            <motion.div className="traditional-card absolute z-20 w-full max-w-xl bg-white/80 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl border border-red-100">
               <div className="flex items-center gap-6 mb-10 text-red-500">
                  <div className="p-4 bg-red-50 rounded-2xl animate-pulse">
                    <AlertTriangle size={32} />
                  </div>
                  <h3 className="text-4xl font-black text-[#0D1B2A]">العمل التقليدي</h3>
               </div>
               <div className="space-y-6">
                 {[
                   "ضياع الحقوق المالية بسبب غياب الضمان.",
                   "عمولات خفية وغير مبررة من الوسطاء.",
                   "نزاعات تستمر لشهور دون حل عادل."
                 ].map((text, i) => (
                   <div key={i} className="flex gap-4 items-start text-gray-500 font-bold text-lg">
                     <span className="w-2 h-2 rounded-full bg-red-400 mt-2.5 shrink-0" />
                     {text}
                   </div>
                 ))}
               </div>
            </motion.div>

            {/* Stage 2: Kafeel Secured Card (Reveals on Scroll) */}
            <motion.div className="kafeel-assembly-container absolute z-20 w-full max-w-xl bg-[#0D1B2A]/90 backdrop-blur-2xl p-12 rounded-[3rem] shadow-[0_0_100px_rgba(201,168,76,0.15)] border border-[#C9A84C]/30 opacity-0 scale-90">
               <div className="flex items-center gap-6 mb-10 text-[#C9A84C]">
                  <div className="p-4 bg-[#C9A84C]/10 rounded-2xl shadow-[0_0_20px_rgba(201,168,76,0.2)]">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-4xl font-black text-white">مع كفيل</h3>
               </div>
               <div className="space-y-6 mb-12">
                 {[
                   "أموالك في خزنة بنكية مستقلة حتى الاستلام.",
                   "شفافية مطلقة في كل معاملة وميزانية.",
                   "عدالة فورية مدعومة بالذكاء الاصطناعي."
                 ].map((text, i) => (
                   <div key={i} className="flex gap-4 items-start text-blue-100/70 font-bold text-lg">
                     <CheckCircle className="text-[#C9A84C] mt-1 shrink-0" size={20} />
                     {text}
                   </div>
                 ))}
               </div>
               <Link to="/register" className="block w-full py-6 bg-[#C9A84C] text-[#0D1B2A] font-black text-center rounded-2xl hover:bg-[#D4B55E] transition-all shadow-xl shadow-blue-950">
                  ابدأ تجربتك الآمنة الآن
               </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 🤖 AI JUSTICE - Cyberpunk Tech Aesthetic */}
      <section id="ai-justice" className="reveal-section py-40 bg-white dark:bg-[#08111A] relative overflow-hidden transition-colors duration-500">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-10 bg-blue-100/50 blur-[80px] rounded-full -z-10"></div>
            <motion.div 
              initial={{ rotate: -5, scale: 0.9 }}
              whileInView={{ rotate: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-white dark:bg-[#0D1B2A] border-8 border-gray-100 dark:border-white/5 rounded-[3rem] shadow-2xl overflow-hidden transition-colors"
            >
              <div className="bg-gray-900 p-6 flex gap-3 border-b border-gray-800">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-500 text-[10px] font-mono mr-auto uppercase tracking-widest">ai-justice-engine.js</span>
              </div>
              <div className="p-8 space-y-6">
                <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/10 transition-colors">
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase">تحليل الميزانية</span>
                      <span className="text-xs font-bold text-gray-400">ID: #8829</span>
                   </div>
                   <h4 className="font-bold text-xl mb-2 text-[#0D1B2A] dark:text-white">تصميم تطبيق كامل (iOS)</h4>
                   <p className="text-2xl font-black text-[#0D1B2A] dark:text-white mb-4">$200.00</p>
                   <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-4 rounded-xl flex gap-4 items-start transition-colors">
                      <AlertTriangle className="text-red-500 shrink-0" size={20}/>
                      <p className="text-sm font-bold text-red-900 dark:text-red-300">تحذير: السعر أقل من متوسط السوق بنسبة 70%. هذا السعر قد يعتبر مجحفاً للمستقل.</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 text-gray-400 animate-pulse">
                   <BrainCircuit size={20}/>
                   <span className="text-xs font-mono">الذكاء الاصطناعي يقوم بتحليل العقد...</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-black px-5 py-2 rounded-full text-sm mb-8 border border-indigo-100 dark:border-indigo-500/20 transition-colors">
              <Zap size={16} /> مدعوم بـ GPT-4o
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#0D1B2A] dark:text-white mb-8 leading-[1.2] tracking-tight transition-colors">
              مقـيم العدالة<br />
              <span className="text-indigo-600 dark:text-indigo-400">كاشف الاستغلال.</span>
            </h2>
            <p className="text-lg text-gray-500 mb-12 leading-relaxed font-medium">
              أول نظام ذكاء اصطناعي في المنطقة يراقب تسعير المهام بشكل آلي. إذا حاول أي طرف استغلال الآخر بميزانيات غير منطقية، يتدخل النظام فوراً لتقديم نصيحة سعرية عادلة بناءً على متوسطات السوق.
            </p>
            <div className="space-y-6">
              {[
                { icon: Scale, title: 'تحكيم فوري', desc: 'في حال النزاع، يقوم الـ AI بتلخيص المشكلة واقتراح حل عادل في ثوانٍ.' },
                { icon: Sparkles, title: 'تحليل العقود', desc: 'كشف الثغرات في وصف المشاريع قبل البدء لضمان وضوح المهام.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-14 h-14 bg-white dark:bg-[#0D1B2A] border border-gray-100 dark:border-white/10 shadow-sm rounded-2xl flex items-center justify-center text-[#0D1B2A] dark:text-white group-hover:bg-[#0D1B2A] group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-[#0D1B2A] transition-all duration-300 shrink-0">
                    <item.icon size={24}/>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1 text-[#0D1B2A] dark:text-white">{item.title}</h4>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 FINAL CTA - Apple Card Style */}
      <section className="reveal-section py-40 px-6">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-br from-[#0D1B2A] via-[#16213e] to-[#0D1B2A] rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden max-w-7xl mx-auto shadow-2xl"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -z-10"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl lg:text-[4.5rem] font-black text-white mb-10 leading-relaxed tracking-widest">
              جاهز لتبني مستقبلك<br />بكل أمان؟
            </h2>
            <p className="text-lg md:text-xl text-blue-200 mb-16 max-w-2xl mx-auto font-medium opacity-80">
              انضم إلى آلاف العملاء والمستقلين الذين اختاروا "كفيل" كشريك موثوق لرحلتهم في عالم العمل الحر.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
              <Link to="/register" className="w-full sm:w-auto bg-white text-[#0D1B2A] font-black px-16 py-6 rounded-3xl hover:bg-gray-100 transition-all shadow-2xl text-xl scale-110 hover:scale-115 active:scale-105">
                ابدأ رحلتك الآن
              </Link>
            </div>
            <div className="mt-20 flex flex-wrap justify-center items-center gap-6">
               {[
                 { icon: Lock, label: "مشفر بالكامل", color: "text-blue-400", shadow: "shadow-blue-500/40" },
                 { icon: ShieldCheck, label: "ضمان مالي", color: "text-green-400", shadow: "shadow-green-500/40" },
                 { icon: UserCheck, label: "هوية موثقة", color: "text-amber-400", shadow: "shadow-amber-500/40" }
               ].map((badge, i) => (
                 <motion.div 
                   key={i}
                   whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                   className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-7 py-3.5 rounded-2xl border border-white/20 transition-all cursor-default group shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                 >
                   <badge.icon className={`${badge.color} group-hover:scale-125 transition-transform duration-500 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`} size={20} />
                   <span className="text-sm font-black text-white uppercase tracking-widest transition-colors drop-shadow-sm">{badge.label}</span>
                 </motion.div>
               ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ❓ FAQ SECTION */}
      <section id="faq" className="reveal-section py-32 bg-gray-50/30 dark:bg-[#0a1622] transition-colors duration-500">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#0D1B2A] dark:text-white mb-4 tracking-tight transition-colors">الأسئلة الشائعة</h2>
            <p className="text-gray-500 dark:text-gray-400 font-bold transition-colors">كل ما تحتاج معرفته عن نظام كفيل والضمان المالي.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white dark:bg-[#0D1B2A] rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden transition-all hover:shadow-md">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-right flex justify-between items-center"
                >
                  <span className="font-bold text-lg text-[#0D1B2A] dark:text-white">{faq.q}</span>
                  <ChevronDown className={cn("text-gray-400 dark:text-gray-500 transition-transform", openFaq === i && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-gray-500 dark:text-gray-400 font-medium leading-relaxed border-t border-gray-50 dark:border-white/5 transition-colors">
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

      {/* 💰 PRICING SECTION */}
      <section id="pricing" className="py-32 px-6 md:px-12 bg-white dark:bg-[#08111A] transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block bg-[#C9A84C]/10 dark:bg-[#C9A84C]/5 text-[#C9A84C] font-black text-xs uppercase tracking-widest px-5 py-2 rounded-full mb-6 border border-[#C9A84C]/20">
              الأسعار والخطط
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-[#0D1B2A] dark:text-white mb-6 tracking-tight transition-colors">
              ادفع فقط عند <span className="text-[#C9A84C]">نجاح مشروعك</span>
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium transition-colors">
              لا عمولات خفية. لا مفاجآت. خطط واضحة تناسب كل حجم من أحجام الأعمال.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
            
            {/* Basic */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="relative bg-white dark:bg-[#0D1B2A] border-2 border-gray-100 dark:border-white/5 rounded-3xl p-8 flex flex-col transition-colors hover:border-gray-200 dark:hover:border-white/10 hover:shadow-xl group"
            >
              <div className="mb-8">
                <span className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Basic</span>
                <h3 className="text-2xl font-black text-[#0D1B2A] dark:text-white mt-2 mb-1 transition-colors">مجاني</h3>
                <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">للأفراد يبدأون رحلتهم</p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-5xl font-black text-[#0D1B2A] dark:text-white transition-colors">$0</span>
                  <span className="text-gray-400 mb-2 font-medium">/شهر</span>
                </div>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {[
                  '✅ مشروع واحد نشط في كل وقت',
                  '✅ مستقل واحد فقط لكل مهمة',
                  '✅ خزنة Escrow مدمجة',
                  '✅ نظام التسليم الموثق',
                  '❌ لا تحكيم مجتمعي',
                  '❌ لا تقارير مالية'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">{f}</li>
                ))}
              </ul>
              <motion.a
                href="/register"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full text-center py-3.5 rounded-2xl border-2 border-gray-200 dark:border-white/10 text-[#0D1B2A] dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                ابدأ مجاناً
              </motion.a>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative bg-white dark:bg-[#0D1B2A] border-2 border-gray-100 dark:border-white/5 rounded-3xl p-8 flex flex-col transition-colors hover:border-blue-200 dark:hover:border-blue-500/20 hover:shadow-xl"
            >
              <div className="mb-8">
                <span className="text-xs font-black text-blue-500 uppercase tracking-widest">Pro</span>
                <h3 className="text-2xl font-black text-[#0D1B2A] dark:text-white mt-2 mb-1 transition-colors">المحترف</h3>
                <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">للمشاريع المتعددة والفرق الصغيرة</p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-5xl font-black text-[#0D1B2A] dark:text-white transition-colors">$29</span>
                  <span className="text-gray-400 mb-2 font-medium">/شهر</span>
                </div>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {[
                  '✅ حتى 15 مشروعاً نشطاً',
                  '✅ حتى 6 مستقلين لكل مشروع',
                  '✅ خزنة Escrow مدمجة',
                  '✅ التحكيم المجتمعي للنزاعات',
                  '✅ تقارير مالية أساسية',
                  '✅ إشعارات بريد إلكتروني',
                  '❌ منسق مخصص'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">{f}</li>
                ))}
              </ul>
              <motion.a
                href="/register"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full text-center py-3.5 rounded-2xl border-2 border-blue-500 text-blue-600 dark:text-blue-400 font-bold text-sm hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
              >
                ابدأ تجربة 14 يوم
              </motion.a>
            </motion.div>

            {/* Premium — MOST POPULAR */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative bg-[#0D1B2A] dark:bg-[#C9A84C]/10 border-2 border-[#C9A84C] rounded-3xl p-8 flex flex-col shadow-2xl shadow-[#C9A84C]/20 scale-[1.02]"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-[#C9A84C] text-[#0D1B2A] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
                  ⭐ الأكثر شيوعاً
                </span>
              </div>
              <div className="mb-8">
                <span className="text-xs font-black text-[#C9A84C] uppercase tracking-widest">Premium</span>
                <h3 className="text-2xl font-black text-white mt-2 mb-1">المتميز</h3>
                <p className="text-white/50 text-sm font-medium">للشركات التي تتوسع بثقة</p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-5xl font-black text-white">$79</span>
                  <span className="text-white/50 mb-2 font-medium">/شهر</span>
                </div>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {[
                  '✅ مشاريع ومستقلين بلا حدود',
                  '✅ تحكيم ذو أولوية قصوى',
                  '✅ منسق مشاريع مخصص',
                  '✅ لوحة تحليلات متقدمة',
                  '✅ تقارير PDF تلقائية',
                  '✅ API للتكامل مع أنظمتك',
                  '✅ دعم أولوية 24/7'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-medium text-white/80">{f}</li>
                ))}
              </ul>
              <motion.a
                href="/register"
                whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(201,168,76,0.5)' }}
                whileTap={{ scale: 0.98 }}
                className="block w-full text-center py-3.5 rounded-2xl bg-[#C9A84C] text-[#0D1B2A] font-black text-sm transition-all"
              >
                ابدأ تجربة 14 يوم
              </motion.a>
            </motion.div>

            {/* Enterprise */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative bg-white dark:bg-[#0D1B2A] border-2 border-gray-100 dark:border-white/5 rounded-3xl p-8 flex flex-col transition-colors hover:border-purple-200 dark:hover:border-purple-500/20 hover:shadow-xl"
            >
              <div className="mb-8">
                <span className="text-xs font-black text-purple-500 uppercase tracking-widest">Enterprise</span>
                <h3 className="text-2xl font-black text-[#0D1B2A] dark:text-white mt-2 mb-1 transition-colors">المؤسسات</h3>
                <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">حلول مخصصة لفرق الأعمال الكبيرة</p>
                <div className="mt-6">
                  <span className="text-3xl font-black text-[#0D1B2A] dark:text-white transition-colors">تواصل معنا</span>
                </div>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {[
                  '✅ كل ما في Premium',
                  '✅ SLA مضمون 99.9% uptime',
                  '✅ بيئة منفصلة (Private Instance)',
                  '✅ تكامل مع SAP / ERP',
                  '✅ فريق دعم مخصص',
                  '✅ تدريب الفريق',
                  '✅ عقد مخصص وفاتورة شهرية'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">{f}</li>
                ))}
              </ul>
              <motion.a
                href="mailto:enterprise@kafil.sa"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full text-center py-3.5 rounded-2xl bg-[#0D1B2A] dark:bg-white text-white dark:text-[#0D1B2A] font-bold text-sm transition-all hover:opacity-90"
              >
                تواصل مع فريق المبيعات
              </motion.a>
            </motion.div>

          </div>

          {/* Bottom note */}
          <p className="text-center text-gray-400 dark:text-gray-500 font-medium text-sm mt-12 transition-colors">
            جميع الخطط تشمل خزنة Escrow مدمجة وحماية مالية كاملة للعملاء والمستقلين. العمولة على المعاملات <span className="font-black text-[#0D1B2A] dark:text-white">5%</span> فقط.
          </p>
        </div>
      </section>

      {/* 🏁 FOOTER - Minimalist Apple Style */}
      <footer className="bg-white dark:bg-[#08111A] pt-32 pb-16 px-6 md:px-12 border-t border-gray-100 dark:border-white/5 transition-colors duration-500">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-20 mb-24">
          <div className="md:col-span-2">
            <div className="text-3xl font-black text-[#0D1B2A] dark:text-white flex items-center gap-4 mb-8 transition-colors">
               <div className="bg-[#0D1B2A] dark:bg-white p-2 rounded-2xl transition-colors">
                <ShieldCheck className="text-white dark:text-[#0D1B2A] transition-colors" size={28}/>
               </div>
               كفيل
            </div>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-md font-medium leading-relaxed transition-colors">
              كفيل هو المعيار الجديد للأمان في العمل الحر. بنينا نظاماً يضمن حق الجميع، ويحول دون أي محاولة للاستغلال المالي.
            </p>
          </div>
          <div>
            <h4 className="font-black text-[#0D1B2A] dark:text-white mb-8 text-lg transition-colors">المنصة</h4>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400 font-bold transition-colors">
              <li><a href="#about" className="hover:text-blue-600 transition-colors">عن كفيل</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-600 transition-colors">نظام الضمان</a></li>
              <li><a href="#ai-justice" className="hover:text-blue-600 transition-colors">مقـيم العدالة</a></li>
              <li><a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">الأسعار</a></li>
              <li><a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">الأسئلة الشائعة</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-[#0D1B2A] dark:text-white mb-8 text-lg transition-colors">قانوني</h4>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400 font-bold transition-colors">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">الشروط والأحكام</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">سياسة الخصوصية</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">قواعد التحكيم</a></li>
            </ul>
          </div>
        </div>
        <div className="hidden lg:flex gap-10 text-gray-500 font-bold text-sm justify-center mb-12">
          {[
                      { name: 'الرئيسية', id: 'home' },
            { name: 'من نحن', id: 'about' },
            { name: 'كيفية العمل', id: 'how-it-works' },
            { name: 'الذكاء الاصطناعي', id: 'ai-justice' },
            { name: 'الأسعار', id: 'pricing' },
            { name: 'الأسئلة الشائعة', id: 'faq' }
          ].map((item, i) => (
            <motion.a 
              key={i} 
              href={`#${item.id}`} 
              whileHover={{ y: -2, color: isDark ? '#fff' : '#0D1B2A' }}
              className="hover:text-blue-900 dark:hover:text-white transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C9A84C] transition-all group-hover:w-full"></span>
            </motion.a>
          ))}
        </div>
        <div className="border-t border-gray-100 dark:border-white/5 max-w-7xl mx-auto pt-12 flex flex-col md:flex-row justify-between items-center text-gray-400 dark:text-gray-500 font-bold text-sm transition-colors">
          <p>© {new Date().getFullYear()} كفيل - Kafeel. كل الحقوق محفوظة.</p>
          <div className="flex gap-10 mt-6 md:mt-0">
             {['Twitter (X)', 'LinkedIn', 'Instagram'].map((social) => (
               <motion.a 
                 key={social} 
                 href="#" 
                 whileHover={{ scale: 1.1, color: isDark ? '#fff' : '#0D1B2A' }}
                 className="hover:text-[#0D1B2A] dark:hover:text-white transition-colors"
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
