"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowRight, Copy, Check, Trash2, ChevronDown, ChevronUp,
    ShoppingBag, Banknote, CreditCard, TrendingUp, Calendar,
} from "lucide-react";
import {
    loadAllSales, groupByDay, clearAllSales, formatTime,
    type DaySummary, type SaleRecord,
} from "@/lib/sales";
import { isAuthenticated } from "@/lib/auth";

function SmokeIcon({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M40 118 C36 95, 48 75, 38 55 C28 35, 45 18, 40 2" stroke="url(#sg1)" strokeWidth="3" strokeLinecap="round" fill="none" />
            <defs>
                <linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0%" stopColor="#DCC08D" stopOpacity="0" />
                    <stop offset="45%" stopColor="#C4A882" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#8C7048" stopOpacity="0.4" />
                </linearGradient>
            </defs>
        </svg>
    );
}

// ── Single sale card ──
function SaleCard({ sale }: { sale: SaleRecord }) {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const text =
            `🕐 ${formatTime(sale.timestamp)}\n` +
            sale.items.map((i) => `${i.name} × ${i.quantity} = ${i.total} ريال`).join("\n") +
            `\n------------\nالإجمالي: ${sale.total} ريال\nطريقة الدفع: ${sale.paymentMethod}`;
        try { await navigator.clipboard.writeText(text); } catch {
            const ta = document.createElement("textarea");
            ta.value = text; document.body.appendChild(ta); ta.select();
            document.execCommand("copy"); document.body.removeChild(ta);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="luxury-card rounded-xl overflow-hidden">
            {/* Header row */}
            <div className="flex items-center gap-3 p-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${sale.paymentMethod === "نقدي"
                    ? "bg-emerald-950/60 border border-emerald-700/30"
                    : "bg-blue-950/60 border border-blue-700/30"
                    }`}>
                    {sale.paymentMethod === "نقدي"
                        ? <Banknote className="w-4 h-4 text-emerald-400" />
                        : <CreditCard className="w-4 h-4 text-blue-400" />
                    }
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-silk-300 text-xs font-medium">{formatTime(sale.timestamp)}</span>
                        <span className="text-champagne-800 text-xs">·</span>
                        <span className="text-champagne-600 text-xs">{sale.items.length} منتج</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${sale.paymentMethod === "نقدي"
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-700/20"
                            : "bg-blue-950/60 text-blue-400 border border-blue-700/20"
                            }`}>{sale.paymentMethod}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-end">
                        <span className="gold-text font-black text-lg">{sale.total}</span>
                        <span className="text-champagne-700 text-xs ms-1">ريال</span>
                    </div>

                    <button
                        onClick={handleCopy}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${copied
                            ? "bg-emerald-900/50 text-emerald-400 border border-emerald-600/30"
                            : "border border-champagne-800/30 text-champagne-600 hover:text-champagne-400 hover:border-champagne-600/40"
                            }`}
                    >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-7 h-7 rounded-lg border border-champagne-800/30 text-champagne-600 flex items-center justify-center hover:text-champagne-400 transition-colors"
                    >
                        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>

            {/* Expanded items */}
            {expanded && (
                <div className="border-t border-champagne-900/15 p-3 space-y-1.5 animate-fade-in">
                    {sale.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                            <span className="text-silk-400 truncate flex-1">{item.name}</span>
                            <span className="text-silk-500 mx-3 flex-shrink-0">× {item.quantity}</span>
                            <span className="text-champagne-500 font-bold flex-shrink-0">{item.total} ريال</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Day section ──
function DaySection({ day }: { day: DaySummary }) {
    const [open, setOpen] = useState(true);
    const [copied, setCopied] = useState(false);

    const handleCopyDay = async () => {
        const lines = day.sales.map((s) =>
            `${formatTime(s.timestamp)} — ${s.items.map((i) => `${i.name} ×${i.quantity}`).join("، ")} — ${s.total} ريال (${s.paymentMethod})`
        );
        const text =
            `📅 ${day.label}\n` +
            lines.join("\n") +
            `\n============\nإجمالي اليوم: ${day.dayTotal} ريال` +
            (day.cashTotal > 0 ? `\n💵 نقدي: ${day.cashTotal} ريال` : "") +
            (day.networkTotal > 0 ? `\n💳 شبكة: ${day.networkTotal} ريال` : "");
        try { await navigator.clipboard.writeText(text); } catch {
            const ta = document.createElement("textarea");
            ta.value = text; document.body.appendChild(ta); ta.select();
            document.execCommand("copy"); document.body.removeChild(ta);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
    };

    return (
        <div>
            {/* Day header */}
            <div className="mb-3 py-2.5 px-1 border-b border-champagne-800/20">
                {/* Row 1: date + open/close toggle */}
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 w-full text-start mb-2"
                >
                    <Calendar className="w-4 h-4 text-champagne-600 flex-shrink-0" />
                    <span className="text-silk-200 font-bold text-sm flex-1 truncate">{day.label}</span>
                    {open ? <ChevronUp className="w-4 h-4 text-champagne-700 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-champagne-700 flex-shrink-0" />}
                </button>

                {/* Row 2: totals + copy button — wraps on narrow screens */}
                <div className="flex items-center gap-2 flex-wrap">
                    {day.cashTotal > 0 && (
                        <span className="text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-700/20 px-2 py-1 rounded-lg font-medium">
                            💵 {day.cashTotal}
                        </span>
                    )}
                    {day.networkTotal > 0 && (
                        <span className="text-xs text-blue-400 bg-blue-950/50 border border-blue-700/20 px-2 py-1 rounded-lg font-medium">
                            💳 {day.networkTotal}
                        </span>
                    )}
                    <div className="flex items-center gap-1.5 bg-champagne-900/20 border border-champagne-700/25 px-2 py-1 rounded-lg">
                        <span className="gold-text font-black text-sm">{day.dayTotal}</span>
                        <span className="text-champagne-700 text-xs">ريال</span>
                    </div>
                    <button
                        onClick={handleCopyDay}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ms-auto ${copied
                            ? "bg-emerald-900/40 text-emerald-400 border-emerald-600/30"
                            : "btn-outline"
                            }`}
                    >
                        {copied ? <><Check className="w-3 h-3" /> تم</> : <><Copy className="w-3 h-3" /> نسخ اليوم</>}
                    </button>
                </div>
            </div>

            {/* Sales list */}
            {open && (
                <div className="space-y-2 mb-6">
                    {day.sales.map((sale) => (
                        <SaleCard key={sale.id} sale={sale} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Main page ──
export default function SalesPage() {
    const router = useRouter();
    const [days, setDays] = useState<DaySummary[]>([]);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) { router.replace("/login"); return; }
        setDays(groupByDay(loadAllSales()));
    }, [router]);

    const refresh = useCallback(() => setDays(groupByDay(loadAllSales())), []);

    const handleClear = () => {
        clearAllSales();
        setDays([]);
        setShowClearConfirm(false);
    };

    const grandTotal = days.reduce((acc, d) => acc + d.dayTotal, 0);
    const grandCash = days.reduce((acc, d) => acc + d.cashTotal, 0);
    const grandNetwork = days.reduce((acc, d) => acc + d.networkTotal, 0);
    const totalSales = days.reduce((acc, d) => acc + d.sales.length, 0);

    return (
        <div
            className="min-h-screen flex flex-col font-arabic"
            style={{ background: "linear-gradient(160deg, #0D110F 0%, #171D1B 40%, #1A231E 100%)" }}
        >
            {/* Header */}
            <header className="sticky top-0 z-40 glass border-b border-champagne-900/15 px-4 py-3 flex items-center gap-3">
                <Link href="/dashboard" className="flex items-center gap-1.5 text-champagne-600 hover:text-champagne-400 transition-colors text-sm">
                    <ArrowRight className="w-4 h-4" />
                    <span className="hidden sm:inline">لوحة البيع</span>
                </Link>

                <div className="flex items-center gap-2.5 flex-1">
                    <div className="w-6 h-9 flex-shrink-0">
                        <SmokeIcon className="w-full h-full" />
                    </div>
                    <span className="shimmer-text font-bold text-base">سجل المبيعات</span>
                </div>

                <button
                    onClick={refresh}
                    className="btn-outline px-3 py-1.5 rounded-xl text-xs"
                >
                    تحديث
                </button>
                <button
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center gap-1 text-red-500/50 hover:text-red-400 text-xs transition-colors"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">مسح الكل</span>
                </button>
            </header>

            {/* Stats bar */}
            {totalSales > 0 && (
                <div className="px-4 py-3 border-b border-champagne-900/10 overflow-x-auto no-scrollbar" style={{ background: "rgba(13,17,15,0.5)" }}>
                    <div className="flex gap-3 min-w-max">
                        <div className="flex items-center gap-2 bg-champagne-900/20 border border-champagne-700/20 px-3 py-2 rounded-xl">
                            <TrendingUp className="w-4 h-4 text-champagne-500" />
                            <div>
                                <p className="text-champagne-700 text-xs">الإجمالي الكلي</p>
                                <p className="gold-text font-black text-lg leading-none">{grandTotal} <span className="text-champagne-700 text-xs font-normal">ريال</span></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-700/20 px-3 py-2 rounded-xl">
                            <Banknote className="w-4 h-4 text-emerald-400" />
                            <div>
                                <p className="text-emerald-600 text-xs">نقدي</p>
                                <p className="text-emerald-400 font-black text-lg leading-none">{grandCash} <span className="text-xs font-normal">ريال</span></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-950/30 border border-blue-700/20 px-3 py-2 rounded-xl">
                            <CreditCard className="w-4 h-4 text-blue-400" />
                            <div>
                                <p className="text-blue-600 text-xs">شبكة</p>
                                <p className="text-blue-400 font-black text-lg leading-none">{grandNetwork} <span className="text-xs font-normal">ريال</span></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-charcoal-700/40 border border-champagne-900/20 px-3 py-2 rounded-xl">
                            <ShoppingBag className="w-4 h-4 text-silk-500" />
                            <div>
                                <p className="text-silk-500 text-xs">عدد المبيعات</p>
                                <p className="text-silk-200 font-black text-lg leading-none">{totalSales}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {days.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-24 text-center">
                        <ShoppingBag className="w-16 h-16 text-champagne-800/40 mb-4" />
                        <p className="text-silk-400 text-lg font-medium mb-2">لا توجد مبيعات مسجلة</p>
                        <p className="text-silk-600 text-sm">المبيعات ستُسجل تلقائياً عند نسخ الفاتورة من لوحة البيع</p>
                        <Link href="/dashboard" className="btn-gold mt-6 px-6 py-2.5 rounded-xl text-sm inline-flex items-center gap-2">
                            <ArrowRight className="w-4 h-4" />
                            انتقل للوحة البيع
                        </Link>
                    </div>
                ) : (
                    days.map((day) => <DaySection key={day.dateKey} day={day} />)
                )}
            </div>

            {/* Clear confirm modal */}
            {showClearConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowClearConfirm(false)} />
                    <div className="relative luxury-card rounded-2xl p-6 w-full max-w-sm text-center animate-fade-in">
                        <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-3" />
                        <h3 className="text-silk-100 font-bold text-lg mb-2">مسح جميع السجلات؟</h3>
                        <p className="text-silk-400 text-sm mb-5">هذا الإجراء لا يمكن التراجع عنه وسيحذف جميع بيانات المبيعات.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowClearConfirm(false)} className="btn-outline flex-1 py-2.5 rounded-xl text-sm">إلغاء</button>
                            <button onClick={handleClear} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-900/50 border border-red-500/30 text-red-400 hover:bg-red-900/70 transition-colors">
                                حذف الكل
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
