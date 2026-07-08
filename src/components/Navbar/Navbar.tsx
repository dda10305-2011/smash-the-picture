"use client";

import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <a href="#hero" className={styles.logo}>
          SLAY THE SPIRE <span className={styles.roman}>II</span>
        </a>
        
        <nav className={styles.nav}>
          <a href="#rules" className={styles.navLink}>기초 규칙</a>
          <a href="#characters" className={styles.navLink}>직업 소개</a>
          <a href="#tips" className={styles.navLink}>입문 팁</a>
        </nav>

        <a href="#rules" className={styles.ctaButton}>
          가이드 시작
        </a>
      </div>
    </header>
  );
}
