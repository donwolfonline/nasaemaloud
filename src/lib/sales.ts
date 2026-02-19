// ── Sales recording utility ──
// Persists all completed sales to localStorage grouped by date.

export interface SaleLineItem {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    category: string;
}

export interface SaleRecord {
    id: string;           // unique id (timestamp + random)
    timestamp: number;    // Unix ms
    dateKey: string;      // "YYYY-MM-DD" in local time
    items: SaleLineItem[];
    total: number;
    paymentMethod: "نقدي" | "شبكة";
}

const STORAGE_KEY = "nasaem_sales_v1";

export function saveSale(sale: Omit<SaleRecord, "id" | "dateKey">): SaleRecord {
    const record: SaleRecord = {
        ...sale,
        id: `${sale.timestamp}-${Math.random().toString(36).slice(2, 7)}`,
        dateKey: new Date(sale.timestamp).toLocaleDateString("ar-SA-u-ca-gregory", {
            year: "numeric", month: "2-digit", day: "2-digit",
        }).split("/").reverse().join("-"), // normalize to YYYY-MM-DD
    };

    // Use a simple date string for the key
    const local = new Date(sale.timestamp);
    record.dateKey = `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, "0")}-${String(local.getDate()).padStart(2, "0")}`;

    const all = loadAllSales();
    all.unshift(record); // newest first
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return record;
}

export function loadAllSales(): SaleRecord[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as SaleRecord[];
    } catch {
        return [];
    }
}

export interface DaySummary {
    dateKey: string;       // YYYY-MM-DD
    label: string;         // Arabic formatted date
    sales: SaleRecord[];
    dayTotal: number;
    cashTotal: number;
    networkTotal: number;
}

/** Groups all sales by day, newest day first. */
export function groupByDay(sales: SaleRecord[]): DaySummary[] {
    const map = new Map<string, SaleRecord[]>();
    for (const s of sales) {
        const arr = map.get(s.dateKey) ?? [];
        arr.push(s);
        map.set(s.dateKey, arr);
    }

    // Sort days descending
    const days = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));

    return days.map((key) => {
        const daySales = map.get(key)!;
        const dayTotal = daySales.reduce((acc, s) => acc + s.total, 0);
        const cashTotal = daySales.filter((s) => s.paymentMethod === "نقدي").reduce((acc, s) => acc + s.total, 0);
        const networkTotal = daySales.filter((s) => s.paymentMethod === "شبكة").reduce((acc, s) => acc + s.total, 0);

        // Human-readable label (Arabic)
        const [y, m, d] = key.split("-").map(Number);
        const label = new Date(y, m - 1, d).toLocaleDateString("ar-EG-u-nu-latn", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
        });

        return { dateKey: key, label, sales: daySales, dayTotal, cashTotal, networkTotal };
    });
}

export function clearAllSales(): void {
    localStorage.removeItem(STORAGE_KEY);
}

/** Format a sale time HH:MM */
export function formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString("ar-EG-u-nu-latn", {
        hour: "2-digit", minute: "2-digit", hour12: true,
    });
}
