"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import Rules from "@/components/Rules/Rules";
import Characters from "@/components/Characters/Characters";
import Tips from "@/components/Tips/Tips";

export default function Home() {
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      {
        threshold: 0.05, // 5%만 보여도 트리거되도록 설정하여 스크롤 즉시 반응
        rootMargin: "0px 0px -40px 0px",
      }
    );

    reveals.forEach((el) => observer.observe(el));

    return () => {
      reveals.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Rules />
        <Characters />
        <Tips />
      </main>
      <footer style={{
        padding: "48px 24px",
        textAlign: "center",
        borderTop: "1px solid var(--border)",
        backgroundColor: "var(--background)",
        fontSize: "0.85rem",
        color: "var(--foreground-muted)",
        letterSpacing: "0.02em",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p>© {new Date().getFullYear()} Slay the Spire II 입문자 가이드. All rights reserved.</p>
          <p style={{ marginTop: "8px", fontSize: "0.8rem", opacity: 0.8 }}>
            본 사이트는 슬레이 더 스파이어 II 팬페이지 겸 입문자 튜토리얼 랜딩 페이지입니다.
          </p>
        </div>
      </footer>
    </>
  );
}
