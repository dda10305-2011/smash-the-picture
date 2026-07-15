import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "smash the picture - 스트레스 해소용 사진 부수기",
  description: "망치로 사진을 산산조각 내면서 스트레스를 풀어보세요!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main className="container" style={{ flex: 1, paddingBottom: '4rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
