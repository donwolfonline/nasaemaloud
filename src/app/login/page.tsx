"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn, ArrowRight } from "lucide-react";
import { login } from "@/lib/auth";

function SmokeIcon({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M40 118 C36 95, 48 75, 38 55 C28 35, 45 18, 40 2" stroke="url(#lg1)" strokeWidth="3" strokeLinecap="round" fill="none" className="animate-smoke" />
            <path d="M55 110 C50 88, 64 68, 52 48 C40 28, 58 14, 55 0" stroke="url(#lg2)" strokeWidth="2" strokeLinecap="round" fill="none" className="animate-smoke-slow" style={{ opacity: 0.55 }} />
            <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0%" stopColor="#DCC08D" stopOpacity="0" />
                    <stop offset="45%" stopColor="#C4A882" stopOpacity="1" />
                    <stop offset="100%" stopColor="#8C7048" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0%" stopColor="#DCC08D" stopOpacity="0" />
                    <stop offset="55%" stopColor="#C4A882" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#8C7048" stopOpacity="0.2" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        await new Promise((r) => setTimeout(r, 700));
        if (login(username.trim(), password)) {
            router.push("/dashboard");
        } else {
            setError("اسم المستخدم أو كلمة المرور غير صحيحة");
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0D110F 0%, #171D1B 50%, #1A231E 100%)" }}
        >
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-8 blur-[140px]"
                    style={{ background: "radial-gradient(circle, #C4A882, transparent 70%)" }} />
                <div className="hero-grain absolute inset-0 opacity-40" />
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-champagne-600/30 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-champagne-600/20 to-transparent" />
            </div>

            <div className="w-full max-w-sm animate-fade-in relative z-10">
                {/* Back link */}
                <Link href="/" className="inline-flex items-center gap-2 text-champagne-600 text-sm mb-8 hover:text-champagne-400 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                    <span>العودة للرئيسية</span>
                </Link>

                {/* Logo & Brand */}
                <div className="text-center mb-8">
                    <div className="w-14 h-20 mx-auto mb-3 animate-float">
                        <SmokeIcon className="w-full h-full" />
                    </div>
                    <h1 className="shimmer-text text-3xl font-black mb-1">نسائم العود</h1>
                    <p className="text-silk-500 text-xs tracking-widest uppercase">نظام إدارة المبيعات</p>
                </div>

                {/* Card */}
                <div className="luxury-card rounded-3xl p-8 shadow-luxury">
                    <h2 className="text-silk-100 font-bold text-lg mb-6 text-center">تسجيل الدخول</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="block text-champagne-600 text-xs mb-1.5 font-medium">اسم المستخدم</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="أدخل اسم المستخدم"
                                className="input-luxury w-full rounded-xl px-4 py-3 text-sm"
                                required
                                autoComplete="username"
                                dir="rtl"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-champagne-600 text-xs mb-1.5 font-medium">كلمة المرور</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute inset-y-0 start-0 ps-3.5 flex items-center text-champagne-700 hover:text-champagne-500 transition-colors"
                                >
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="أدخل كلمة المرور"
                                    className="input-luxury w-full rounded-xl ps-10 pe-4 py-3 text-sm"
                                    required
                                    autoComplete="current-password"
                                    dir="rtl"
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-950/40 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-3 text-center animate-fade-in">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-gold w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm mt-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-charcoal-800/30 border-t-charcoal-800 rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>دخول</span>
                                    <LogIn className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-silk-500/40 text-xs mt-6">
                    © {new Date().getFullYear()} نسائم العود
                </p>
            </div>
        </div>
    );
}
