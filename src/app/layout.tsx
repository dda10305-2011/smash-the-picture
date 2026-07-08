import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Slay the Spire II 입문자 가이드 - 초보자를 위한 필수 룰 & 팁",
  description: "슬레이 더 스파이어 II (Slay the Spire 2) 입문자와 초보자를 위한 가이드 페이지입니다. 에너지 관리, 덱 순환 등 기초 규칙과 신규 캐릭터 네크로바인더를 포함한 직업 안내 및 핵심 플레이 팁을 제공합니다.",
  keywords: ["Slay the Spire 2", "슬레이 더 스파이어 2", "로그라이크", "덱빌딩", "입문 가이드", "네크로바인더", "게임 공략"],
  openGraph: {
    title: "Slay the Spire II 입문자 가이드",
    description: "슬레이 더 스파이어 II 초보자를 위한 핵심 규칙 및 직업 분석, 실전 플레이 팁 요약 랜딩 페이지",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
