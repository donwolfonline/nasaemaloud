// ── Sales recording utility ──
// All sales are persisted via the /api/sales API route (Neon PostgreSQL).

export interface SaleLineItem {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    category: string;
}

export interface SaleRecord {
    id: string;                       // unique id (timestamp + random)
    timestamp: number;                // Unix ms
    dateKey: string;                  // "YYYY-MM-DD" in local time
    items: SaleLineItem[];
    total: number;
    paymentMethod: "نقدي" | "شبكة";
}

export interface DaySummary {
    dateKey: string;       // YYYY-MM-DD
    label: string;         // Arabic formatted date
    sales: SaleRecord[];
    dayTotal: number;
    cashTotal: number;
    networkTotal: number;
}

// ─────────────────────────────────────────────────────────────────────────────

/** Save a completed sale to the database. */
export async function saveSale(
    sale: Omit<SaleRecord, "id" | "dateKey">
): Promise<SaleRecord> {
    const local = new Date(sale.timestamp);
    const dateKey = `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, "0")}-${String(local.getDate()).padStart(2, "0")}`;
    const id = `${sale.timestamp}-${Math.random().toString(36).slice(2, 7)}`;
    const record: SaleRecord = { ...sale, id, dateKey };

    try {
        await fetch("/api/sales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(record),
        });
    } catch (err) {
        console.error("saveSale failed:", err);
    }

    return record;
}

/** Load all sales from the database. */
export async function loadAllSales(): Promise<SaleRecord[]> {
    try {
        const res = await fetch("/api/sales");
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

/** Delete a specific sale from the database. */
export async function deleteSale(id: string): Promise<void> {
    try {
        await fetch(`/api/sales?id=${id}`, { method: "DELETE" });
    } catch (err) {
        console.error("deleteSale failed:", err);
    }
}

/** Delete all sales from the database. */
export async function clearAllSales(): Promise<void> {
    try {
        await fetch("/api/sales", { method: "DELETE" });
    } catch (err) {
        console.error("clearAllSales failed:", err);
    }
}

// ─────────────────────────────────────────────────────────────────────────────

/** Groups all sales by day, newest day first. */
export function groupByDay(sales: SaleRecord[]): DaySummary[] {
    const map = new Map<string, SaleRecord[]>();
    for (const s of sales) {
        const arr = map.get(s.dateKey) ?? [];
        arr.push(s);
        map.set(s.dateKey, arr);
    }

    const days = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));

    return days.map((key) => {
        const daySales = map.get(key)!;
        const dayTotal = daySales.reduce((acc, s) => acc + s.total, 0);
        const cashTotal = daySales.filter((s) => s.paymentMethod === "نقدي").reduce((acc, s) => acc + s.total, 0);
        const networkTotal = daySales.filter((s) => s.paymentMethod === "شبكة").reduce((acc, s) => acc + s.total, 0);

        const [y, m, d] = key.split("-").map(Number);
        const label = new Date(y, m - 1, d).toLocaleDateString("ar-SA-u-ca-islamic-nu-latn", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
        });

        return { dateKey: key, label, sales: daySales, dayTotal, cashTotal, networkTotal };
    });
}

/** Format a sale timestamp as a short time string (e.g. "04:41 ص"). */
export function formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString("ar-SA-u-ca-islamic-nu-latn", {
        hour: "2-digit", minute: "2-digit", hour12: true,
    });
}
