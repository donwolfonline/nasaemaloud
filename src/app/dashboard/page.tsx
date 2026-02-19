"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ShoppingBag, RotateCcw,
    LogOut, Minus, Plus, Trash2, ChevronDown, ClipboardList,
} from "lucide-react";
import { products, categories, categoryIcons, type Product } from "@/lib/products";
import { isAuthenticated, logout } from "@/lib/auth";
import { saveSale } from "@/lib/sales";

interface CartItem { product: Product; quantity: number; }
type CartMap = Map<string, CartItem>;

function SmokeIcon({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M40 118 C36 95, 48 75, 38 55 C28 35, 45 18, 40 2" stroke="url(#dg1)" strokeWidth="3" strokeLinecap="round" fill="none" className="animate-smoke" />
            <path d="M55 110 C50 88, 64 68, 52 48 C40 28, 58 14, 55 0" stroke="url(#dg2)" strokeWidth="2" strokeLinecap="round" fill="none" className="animate-smoke-slow" style={{ opacity: 0.5 }} />
            <defs>
                <linearGradient id="dg1" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0%" stopColor="#DCC08D" stopOpacity="0" />
                    <stop offset="40%" stopColor="#C4A882" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#8C7048" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="dg2" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                    <stop offset="0%" stopColor="#DCC08D" stopOpacity="0" />
                    <stop offset="55%" stopColor="#C4A882" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#8C7048" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default function DashboardPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartMap>(new Map());
    const [activeCategory, setActiveCategory] = useState("الكل");
    const [summaryOpen, setSummaryOpen] = useState(false);
    const [flashId, setFlashId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<"نقدي" | "شبكة">("نقدي");

    useEffect(() => {
        if (!isAuthenticated()) router.replace("/login");
    }, [router]);

    const handleLogout = () => { logout(); router.replace("/login"); };

    const filtered = activeCategory === "الكل"
        ? products
        : products.filter((p) => p.category === activeCategory);

    const cartTotal = Array.from(cart.values()).reduce(
        (sum, item) => sum + item.product.price * item.quantity, 0
    );
    const cartItemCount = Array.from(cart.values()).reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const addProduct = useCallback((product: Product) => {
        setCart((prev) => {
            const next = new Map(prev);
            const ex = next.get(product.id);
            next.set(product.id, ex
                ? { ...ex, quantity: ex.quantity + 1 }
                : { product, quantity: 1 }
            );
            return next;
        });
        setFlashId(product.id);
        setTimeout(() => setFlashId(null), 350);
    }, []);

    const setQuantity = useCallback((productId: string, qty: number) => {
        setCart((prev) => {
            const next = new Map(prev);
            if (qty <= 0) next.delete(productId);
            else {
                const item = next.get(productId);
                if (item) next.set(productId, { ...item, quantity: qty });
            }
            return next;
        });
    }, []);

    const removeItem = useCallback((id: string) => {
        setCart((prev) => { const n = new Map(prev); n.delete(id); return n; });
    }, []);


    const resetCart = async () => {
        // Capture current state before clearing
        const items = Array.from(cart.values());
        const currentTotal = cartTotal;
        const currentPayment = paymentMethod;

        // Clear cart immediately for snappy UX
        setCart(new Map());
        setSummaryOpen(false);
        setPaymentMethod("نقدي");

        // Persist sale to DB in background
        if (items.length > 0) {
            saveSale({
                timestamp: Date.now(),
                items: items.map((i) => ({
                    name: i.product.name,
                    quantity: i.quantity,
                    unitPrice: i.product.price,
                    total: i.product.price * i.quantity,
                    category: i.product.category,
                })),
                total: currentTotal,
                paymentMethod: currentPayment,
            }).catch((err) => console.error("resetCart: saveSale failed:", err));
        }
    };


    const cartItems = Array.from(cart.values());

    return (
        <div
            className="min-h-screen flex flex-col font-arabic"
            style={{ background: "linear-gradient(160deg, #0D110F 0%, #171D1B 40%, #1A231E 100%)" }}
        >
            {/* ── HEADER ── */}
            <header className="sticky top-0 z-40 glass border-b border-champagne-900/15 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-7 h-10 flex-shrink-0">
                        <SmokeIcon className="w-full h-full" />
                    </div>
                    <div className="leading-none">
                        <span className="shimmer-text font-bold text-base block">نسائم العود</span>
                        <span className="text-champagne-700 text-xs">نقطة البيع</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Mobile cart trigger */}
                    <button
                        onClick={() => setSummaryOpen(!summaryOpen)}
                        className="relative flex items-center gap-2 btn-outline px-3 py-2 rounded-xl text-sm md:hidden"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span className="font-bold text-champagne-400">{cartTotal} ر</span>
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1.5 -end-1.5 bg-gradient-to-br from-champagne-400 to-champagne-600 text-charcoal-900 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-gold">
                                {cartItemCount > 9 ? "9+" : cartItemCount}
                            </span>
                        )}
                    </button>

                    {/* Sales history link */}
                    <Link
                        href="/sales"
                        className="flex items-center gap-1.5 btn-outline px-3 py-2 rounded-xl text-sm"
                    >
                        <ClipboardList className="w-4 h-4" />
                        <span className="hidden sm:inline text-xs">السجل</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 bg-red-950/30 border border-red-500/20 text-red-400 px-3 py-2 rounded-xl text-sm hover:bg-red-950/50 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline text-xs">خروج</span>
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* ── PRODUCTS PANEL ── */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {/* Category tabs */}
                    <div className="px-3 py-2.5 border-b border-champagne-900/10" style={{ background: "rgba(13,17,15,0.5)" }}>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`cat-pill flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium ${activeCategory === cat ? "active" : ""}`}
                                >
                                    <span className="text-base">{categoryIcons[cat]}</span>
                                    <span>{cat}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products grid */}
                    <div className="flex-1 overflow-y-auto p-3">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
                            {filtered.map((product) => {
                                const cartItem = cart.get(product.id);
                                const qty = cartItem?.quantity ?? 0;
                                const isFlashing = flashId === product.id;
                                return (
                                    <div
                                        key={product.id}
                                        className={`product-card rounded-xl overflow-hidden ${qty > 0 ? "in-cart" : ""} ${isFlashing ? "animate-scale-in" : ""}`}
                                    >
                                        {/* Qty badge */}
                                        {qty > 0 && (
                                            <div className="absolute top-2 start-2 z-10 bg-gradient-to-br from-champagne-400 to-champagne-600 text-charcoal-900 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-gold animate-scale-in">
                                                {qty}
                                            </div>
                                        )}

                                        {/* Tap area */}
                                        <button onClick={() => addProduct(product)} className="w-full p-3 text-start relative">
                                            <div className="text-2xl mb-2">{categoryIcons[product.category]}</div>
                                            <p className="text-silk-200 text-xs font-medium leading-snug mb-2 line-clamp-2">{product.name}</p>
                                            <p className="font-bold text-sm">
                                                <span className="gold-text">{product.price}</span>
                                                <span className="text-champagne-700 text-xs font-normal"> ريال</span>
                                            </p>
                                        </button>

                                        {/* +/- row */}
                                        {qty > 0 && (
                                            <div className="flex items-center gap-1 px-2 pb-2 animate-fade-in">
                                                <button
                                                    onClick={() => setQuantity(product.id, qty - 1)}
                                                    className="flex-1 flex items-center justify-center py-1.5 rounded-lg border border-champagne-800/40 text-champagne-500 hover:bg-champagne-900/20 transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-silk-200 font-bold text-xs w-6 text-center">{qty}</span>
                                                <button
                                                    onClick={() => addProduct(product)}
                                                    className="flex-1 flex items-center justify-center py-1.5 rounded-lg bg-champagne-900/30 border border-champagne-700/30 text-champagne-400 hover:bg-champagne-900/50 transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>

                {/* ── DESKTOP SIDEBAR ── */}
                <aside className="hidden md:flex w-80 flex-col border-s border-champagne-900/15" style={{ background: "rgba(13,17,15,0.7)", backdropFilter: "blur(12px)" }}>
                    <SaleSummary
                        cartItems={cartItems}
                        cartTotal={cartTotal}
                        onRemove={removeItem}
                        onSetQty={setQuantity}
                        onReset={resetCart}
                        paymentMethod={paymentMethod}
                        onSetPayment={setPaymentMethod}
                    />
                </aside>
            </div>

            {/* ── MOBILE DRAWER ── */}
            {summaryOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSummaryOpen(false)} />
                    <div
                        className="absolute bottom-0 start-0 end-0 rounded-t-3xl border-t border-champagne-800/20 max-h-[86vh] flex flex-col animate-slide-up"
                        style={{ background: "rgba(13,17,15,0.98)" }}
                    >
                        <div className="flex justify-center pt-3 pb-0">
                            <button onClick={() => setSummaryOpen(false)} className="p-1">
                                <ChevronDown className="w-5 h-5 text-champagne-700" />
                            </button>
                        </div>
                        <SaleSummary
                            cartItems={cartItems}
                            cartTotal={cartTotal}
                            onRemove={removeItem}
                            onSetQty={setQuantity}
                            onReset={resetCart}
                            paymentMethod={paymentMethod}
                            onSetPayment={setPaymentMethod}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// ── SALE SUMMARY ──
interface SaleSummaryProps {
    cartItems: CartItem[]; cartTotal: number;
    onRemove: (id: string) => void; onSetQty: (id: string, qty: number) => void;
    onReset: () => void;
    paymentMethod: "نقدي" | "شبكة"; onSetPayment: (m: "نقدي" | "شبكة") => void;
}

function SaleSummary({ cartItems, cartTotal, onRemove, onSetQty, onReset, paymentMethod, onSetPayment }: SaleSummaryProps) {
    return (
        <>
            {/* Header */}
            <div className="px-4 py-3 border-b border-champagne-900/15 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-champagne-500" />
                    <span className="text-silk-200 font-bold text-sm">ملخص البيع</span>
                    {cartItems.length > 0 && (
                        <span className="bg-gradient-to-br from-champagne-500 to-champagne-700 text-charcoal-900 text-xs font-black px-1.5 py-0.5 rounded-full">
                            {cartItems.length}
                        </span>
                    )}
                </div>
                {cartItems.length > 0 && (
                    <button onClick={onReset} className="flex items-center gap-1 text-red-500/60 hover:text-red-400 text-xs transition-colors">
                        <RotateCcw className="w-3 h-3" />
                        <span>مسح</span>
                    </button>
                )}
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                        <div className="w-16 h-20 mx-auto mb-3 opacity-30">
                            <ShoppingBag className="w-10 h-10 mx-auto text-champagne-600" />
                        </div>
                        <p className="text-silk-500 text-sm">لا توجد منتجات مضافة</p>
                        <p className="text-silk-600 text-xs mt-1">اضغط على أي منتج للإضافة</p>
                    </div>
                ) : (
                    cartItems.map((item) => (
                        <div key={item.product.id} className="luxury-card rounded-xl p-2.5 flex items-center gap-2 animate-fade-in">
                            <span className="text-xl flex-shrink-0">{categoryIcons[item.product.category]}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-silk-200 text-xs font-medium truncate">{item.product.name}</p>
                                <p className="text-champagne-600 text-xs">
                                    {item.product.price} × {item.quantity} = <span className="text-champagne-400 font-bold">{item.product.price * item.quantity}</span> ريال
                                </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <button onClick={() => onSetQty(item.product.id, item.quantity - 1)}
                                    className="w-6 h-6 rounded-lg border border-champagne-800/30 text-champagne-600 flex items-center justify-center hover:bg-champagne-900/20 transition-colors">
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-silk-200 text-xs font-bold w-4 text-center">{item.quantity}</span>
                                <button onClick={() => onSetQty(item.product.id, item.quantity + 1)}
                                    className="w-6 h-6 rounded-lg bg-champagne-900/30 border border-champagne-700/25 text-champagne-500 flex items-center justify-center hover:bg-champagne-900/50 transition-colors">
                                    <Plus className="w-3 h-3" />
                                </button>
                                <button onClick={() => onRemove(item.product.id)}
                                    className="w-6 h-6 rounded-lg text-red-500/40 hover:text-red-400 hover:bg-red-950/30 flex items-center justify-center transition-colors ms-0.5">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-champagne-900/15 p-4 space-y-3">
                {/* Payment method toggle */}
                <div>
                    <p className="text-champagne-700 text-xs mb-1.5 font-medium">طريقة الدفع</p>
                    <div className="grid grid-cols-2 gap-2">
                        {(["نقدي", "شبكة"] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => onSetPayment(m)}
                                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 ${paymentMethod === m
                                    ? "bg-gradient-to-br from-champagne-500 to-champagne-700 text-charcoal-900 border-champagne-500 shadow-gold"
                                    : "bg-transparent border-champagne-800/30 text-champagne-600 hover:border-champagne-600/50 hover:text-champagne-400"
                                    }`}
                            >
                                <span>{m === "نقدي" ? "💵" : "💳"}</span>
                                <span>{m}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Total */}
                <div className="rounded-xl px-4 py-3 flex items-center justify-between border border-champagne-800/20" style={{ background: "rgba(13,17,15,0.6)" }}>
                    <span className="text-silk-400 text-sm">الإجمالي</span>
                    <div>
                        <span className="gold-text font-black text-2xl">{cartTotal}</span>
                        <span className="text-champagne-700 text-xs ms-1">ريال</span>
                    </div>
                </div>

                {/* Reset — records sale automatically */}
                <button
                    onClick={onReset}
                    disabled={cartItems.length === 0}
                    className="btn-gold w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <RotateCcw className="w-4 h-4" />
                    <span>تصفير للزبون التالي</span>
                </button>
            </div>
        </>
    );
}
