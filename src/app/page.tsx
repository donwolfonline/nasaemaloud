"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowLeft, Star } from "lucide-react";

// Animated smoke SVG component
function SmokeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M40 118 C36 95, 48 75, 38 55 C28 35, 45 18, 40 2"
        stroke="url(#g1)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        className="animate-smoke"
      />
      <path
        d="M55 110 C50 88, 64 68, 52 48 C40 28, 58 14, 55 0"
        stroke="url(#g2)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        className="animate-smoke-slow"
        style={{ opacity: 0.6 }}
      />
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#DCC08D" stopOpacity="0" />
          <stop offset="40%" stopColor="#C4A882" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#8C7048" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#DCC08D" stopOpacity="0" />
          <stop offset="50%" stopColor="#C4A882" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#8C7048" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Star rating row
function StarRow() {
  return (
    <div className="flex items-center gap-1 justify-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-champagne-500 text-champagne-500" />
      ))}
    </div>
  );
}

const features = [
  { icon: "🪵", title: "عود أصيل", desc: "أجود أنواع العود الكمبودي والهندي المختار بعناية فائقة." },
  { icon: "🌿", title: "بخور فاخر", desc: "مجموعة متنوعة من البخور الملكي والمرصع بأعلى مستويات الجودة." },
  { icon: "💧", title: "دهون عود", desc: "دهون عود خالص بتراكيز مميزة تدوم طويلاً وتترك أثراً عبقاً." },
  { icon: "🌸", title: "مسك وخمريات", desc: "أرق أنواع المسك والخمريات المصنوعة بأسلوب العطارة التقليدية." },
];

const testimonials = [
  { name: "أم خالد", text: "رائحة العود من نسائم العود لا تُضاهى، اشتريت عدة أنواع وكلها تميزت بالجودة العالية." },
  { name: "محمد الغامدي", text: "أفضل بخور جربته في حياتي، الرائحة تبقى لساعات طويلة وتملأ البيت كله." },
  { name: "نورة السالم", text: "خدمة ممتازة ومنتجات فاخرة، أنصح الجميع بتجربة دهن العود من نسائم العود." },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Subtle parallax on hero
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const y = window.scrollY;
        heroRef.current.style.transform = `translateY(${y * 0.3}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#171D1B" }}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-champagne-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo mark */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-10 relative flex-shrink-0">
              <SmokeIcon className="w-full h-full" />
            </div>
            <span className="shimmer-text font-bold text-xl tracking-wide">نسائم العود</span>
          </div>
          <Link
            href="/login"
            className="btn-gold px-5 py-2 rounded-xl text-sm flex items-center gap-2"
          >
            <span>تسجيل الدخول</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div ref={heroRef} className="absolute inset-0">
            <div
              className="absolute top-1/4 right-1/3 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]"
              style={{ background: "radial-gradient(circle, #C4A882 0%, transparent 70%)" }}
            />
            <div
              className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full opacity-6 blur-[100px]"
              style={{ background: "radial-gradient(circle, #8C7048 0%, transparent 70%)" }}
            />
          </div>
          {/* Fine grain texture */}
          <div className="hero-grain absolute inset-0 opacity-50" />
          {/* Bottom fade */}
          <div
            className="absolute bottom-0 inset-x-0 h-48"
            style={{ background: "linear-gradient(to bottom, transparent, #171D1B)" }}
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Large animated smoke */}
          <div className="flex justify-center mb-8 animate-float">
            <div className="w-20 h-28 mx-auto opacity-90">
              <SmokeIcon className="w-full h-full" />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-champagne-700/30 bg-champagne-900/10 px-4 py-1.5 rounded-full text-xs text-champagne-400 mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne-500 animate-pulse" />
            عطور فاخرة من قلب الطبيعة
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-4 animate-fade-up leading-none tracking-tight">
            <span className="shimmer-text">نسائم</span>
            <br />
            <span className="text-silk-100">العود</span>
          </h1>

          {/* Sub heading */}
          <p className="text-silk-500 text-lg sm:text-xl font-light mb-2 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            حيث يلتقي الأصالة بالرقي
          </p>
          <p className="text-champagne-600 text-sm mb-10 animate-fade-up" style={{ animationDelay: "0.15s" }}>
            أجود أنواع العود · البخور · المسك · دهون العود
          </p>

          <StarRow />

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <Link
              href="/login"
              className="btn-gold w-full sm:w-auto px-8 py-4 rounded-2xl text-base flex items-center justify-center gap-3 shadow-gold-lg"
            >
              <span>دخول نظام المبيعات</span>
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="btn-outline w-full sm:w-auto px-8 py-4 rounded-2xl text-base text-center"
            >
              اكتشف منتجاتنا
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="mt-20 flex justify-center animate-bounce">
            <div className="w-6 h-10 rounded-full border border-champagne-700/40 flex items-start justify-center pt-2">
              <div className="w-1 h-2.5 rounded-full bg-champagne-600/60" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-champagne-500 text-sm uppercase tracking-widest mb-3 font-medium">مجموعاتنا</p>
            <h2 className="text-4xl font-bold text-silk-100 mb-4">عالم من العطور الفاخرة</h2>
            <div className="divider-gold w-32 mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className="luxury-card rounded-2xl p-6 text-center group hover:shadow-gold transition-all duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="text-champagne-400 font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-silk-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="divider-gold max-w-2xl mx-auto" />

      {/* ── STATEMENT BAND ── */}
      <section className="py-20 px-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, #C4A882, transparent)" }}
        />
        <p className="relative text-xl sm:text-2xl md:text-4xl font-light text-silk-200 leading-relaxed max-w-3xl mx-auto">
          &ldquo;العطر هو <span className="gold-text font-bold">ذاكرة اللحظات</span>،
          <br className="hidden sm:block" /> ونسائم العود يصنع لك ذكريات لا تُنسى&rdquo;
        </p>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-champagne-500 text-sm uppercase tracking-widest mb-3 font-medium">آراء عملائنا</p>
            <h2 className="text-4xl font-bold text-silk-100">يقولون عنّا</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="luxury-card rounded-2xl p-6">
                <StarRow />
                <p className="text-silk-300 text-sm leading-relaxed mt-4 mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-champagne-600 to-champagne-800 flex items-center justify-center text-charcoal-800 text-xs font-bold flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <span className="text-champagne-500 text-sm font-medium">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BOTTOM ── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="luxury-card rounded-3xl p-6 sm:p-12 relative overflow-hidden animate-glow-pulse">
            <div
              className="absolute inset-0 opacity-5 rounded-3xl"
              style={{ background: "radial-gradient(ellipse at 50% 0%, #C4A882, transparent 70%)" }}
            />
            <div className="relative z-10">
              <div className="w-16 h-20 mx-auto mb-6">
                <SmokeIcon className="w-full h-full" />
              </div>
              <h3 className="text-3xl font-bold text-silk-100 mb-3">هل أنت مستعد؟</h3>
              <p className="text-silk-400 mb-8">ابدأ تجربة التسوق الفاخرة مع نسائم العود</p>
              <Link
                href="/login"
                className="btn-gold inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-base"
              >
                <span>دخول نظام المبيعات</span>
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-champagne-900/20 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-6 h-8">
            <SmokeIcon className="w-full h-full" />
          </div>
          <span className="gold-text font-bold text-lg">نسائم العود</span>
        </div>
        <p className="text-silk-500 text-xs">
          © {new Date().toLocaleDateString("ar-SA-u-ca-islamic-nu-latn", { year: "numeric" })} هـ نسائم العود · جميع الحقوق محفوظة
        </p>
      </footer>
    </div>
  );
}
