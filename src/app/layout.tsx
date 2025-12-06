import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ANURAK KMITL",
  description: "ระบบบริหารจัดการชมรมอนุรักษ์ธรรมชาติและสิ่งแวดล้อมลาดกระบัง",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${kanit.variable} font-sans`}>
      <body
        className="antialiased bg-nature-50"
      >
        {children}
      </body>
    </html>
  );
}
