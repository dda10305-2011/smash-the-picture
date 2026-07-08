import React from "react";
import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.container}>
        <div className={`${styles.content} reveal`}>
          <div className={styles.tag}>NEW RELEASE / BEGINNER GUIDE</div>
          <h1 className={styles.title}>
            방랑자여, 스파이어에 <br />
            다시 맞설 준비가 되었는가?
          </h1>
          <p className={styles.subtitle}>
            슬레이 더 스파이어 2(Slay the Spire II) 입문자를 위한 필수 가이드. 
            카드 선택, 유물 시너지, 직업별 핵심 플레이 방식을 이해하고 거대한 탑의 정상으로 향하세요.
          </p>
          <div className={styles.ctaGroup}>
            <a href="#rules" className={styles.primaryBtn}>
              기초 규칙 알아보기
            </a>
            <a 
              href="https://github.com/dda10305-2011/sts2-my-nord" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.secondaryBtn}
            >
              공식 깃허브 방문
            </a>
          </div>
        </div>
        
        <div className={`${styles.imageWrapper} reveal reveal-delay-2`}>
          <div className={styles.cardFrame}>
            <Image
              src="/spire2_hero.jpg"
              alt="Slay the Spire II Hero Illustration"
              width={600}
              height={337}
              priority
              className={styles.image}
            />
            <div className={styles.cardReflection}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
