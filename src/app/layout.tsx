import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "نسائم العود | عطور فاخرة",
  description: "متجر نسائم العود للعطور والبخور الفاخرة",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-arabic antialiased" style={{ background: "#171D1B" }}>
        {children}
      </body>
    </html>
  );
}
