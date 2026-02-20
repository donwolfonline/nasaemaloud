import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

// Cached table init promise — only runs once per server instance
let initialized: Promise<void> | null = null;

function ensureTables(): Promise<void> {
    if (!initialized) {
        initialized = (async () => {
            await sql`
                CREATE TABLE IF NOT EXISTS sales (
                    id           TEXT PRIMARY KEY,
                    timestamp    BIGINT NOT NULL,
                    date_key     TEXT NOT NULL,
                    total        NUMERIC NOT NULL,
                    payment_method TEXT NOT NULL,
                    created_at   TIMESTAMPTZ DEFAULT NOW()
                )
            `;
            await sql`
                CREATE TABLE IF NOT EXISTS sale_items (
                    id           SERIAL PRIMARY KEY,
                    sale_id      TEXT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
                    name         TEXT NOT NULL,
                    quantity     INTEGER NOT NULL,
                    unit_price   NUMERIC NOT NULL,
                    total        NUMERIC NOT NULL,
                    category     TEXT NOT NULL
                )
            `;
        })();
    }
    return initialized;
}

// ─── GET /api/sales ──────────────────────────────────────────────────────────
export async function GET() {
    try {
        await ensureTables();

        const rows = await sql`
            SELECT
                s.id,
                s.timestamp,
                s.date_key,
                s.total,
                s.payment_method,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'name',      si.name,
                            'quantity',  si.quantity,
                            'unitPrice', si.unit_price,
                            'total',     si.total,
                            'category',  si.category
                        ) ORDER BY si.id
                    ) FILTER (WHERE si.id IS NOT NULL),
                    '[]'
                ) AS items
            FROM sales s
            LEFT JOIN sale_items si ON si.sale_id = s.id
            GROUP BY s.id
            ORDER BY s.timestamp DESC
        `;

        const sales = rows.map((r) => ({
            id: r.id as string,
            timestamp: Number(r.timestamp),
            dateKey: r.date_key as string,
            total: Number(r.total),
            paymentMethod: r.payment_method as "نقدي" | "شبكة",
            items: r.items as {
                name: string;
                quantity: number;
                unitPrice: number;
                total: number;
                category: string;
            }[],
        }));

        return NextResponse.json(sales);
    } catch (err) {
        console.error("[GET /api/sales]", err);
        return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
    }
}

// ─── POST /api/sales ─────────────────────────────────────────────────────────
export async function POST(req: Request) {
    try {
        await ensureTables();
        const sale = await req.json();

        await sql`
            INSERT INTO sales (id, timestamp, date_key, total, payment_method)
            VALUES (${sale.id}, ${sale.timestamp}, ${sale.dateKey}, ${sale.total}, ${sale.paymentMethod})
        `;

        for (const item of sale.items as {
            name: string;
            quantity: number;
            unitPrice: number;
            total: number;
            category: string;
        }[]) {
            await sql`
                INSERT INTO sale_items (sale_id, name, quantity, unit_price, total, category)
                VALUES (${sale.id}, ${item.name}, ${item.quantity}, ${item.unitPrice}, ${item.total}, ${item.category})
            `;
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[POST /api/sales]", err);
        return NextResponse.json({ error: "Failed to save sale" }, { status: 500 });
    }
}

// ─── DELETE /api/sales ───────────────────────────────────────────────────────
export async function DELETE(req: Request) {
    try {
        await ensureTables();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (id) {
            await sql`DELETE FROM sales WHERE id = ${id}`;
        } else {
            await sql`DELETE FROM sales`;
        }
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[DELETE /api/sales]", err);
        return NextResponse.json({ error: "Failed to clear sales" }, { status: 500 });
    }
}
