"use client";

import React, { useState } from "react";
import styles from "./Characters.module.css";

const CHARACTERS = [
  {
    id: "ironclad",
    name: "아이언클래드",
    englishName: "The Ironclad",
    description: "스파이어의 방랑을 시작하기에 가장 적합한 전사입니다. 강력한 체력과 자가 치유 능력을 바탕으로 공격과 수비의 기본을 충실히 학습할 수 있습니다.",
    difficulty: "쉬움 (★☆☆)",
    style: "힘 버프를 통한 대미지 증폭, 강력한 방어도 구축(철벽), 카드 소멸 시너지",
    recomCards: ["피에는 피", "악마의 형상", "무모한 돌진"],
    color: "#ff3e3e",
  },
  {
    id: "silent",
    name: "사일런트",
    englishName: "The Silent",
    description: "단검과 독을 활용하는 노련한 사냥꾼입니다. 매 턴 많은 카드를 드로우하고 순환시키며, 적에게 누적 독 대미지를 주거나 연속 단검 공격으로 적을 분쇄합니다.",
    difficulty: "보통 (★★☆)",
    style: "적 전체 독 중독, 단검(0코스트) 연사 및 공격력 증강, 민첩 버프를 활용한 철저한 수비",
    recomCards: ["유독 가스", "망토와 단검", "촉매"],
    color: "#52b788",
  },
  {
    id: "defect",
    name: "디펙트",
    englishName: "The Defect",
    description: "자가 자각 능력을 얻은 전투용 인형입니다. 전기, 냉기, 플라즈마 등의 구체(Orb)를 소환하여 매 턴 지속 효과를 누리고, 구체를 방출하여 폭발적인 위력을 발휘합니다.",
    difficulty: "어려움 (★★★)",
    style: "구체 슬롯 확장 및 매 턴 패시브 효과 극대화, 구체 방출을 통한 폭탄 대미지, 파워 카드 중심의 덱 빌딩",
    recomCards: ["조각보", "메아리의 형상", "반복"],
    color: "#4ea8de",
  },
  {
    id: "necrobinder",
    name: "네크로바인더",
    englishName: "The Necrobinder",
    description: "슬레이 더 스파이어 II에서 새롭게 데뷔하는 신규 캐릭터입니다. 자신의 피를 깎거나 영혼(자원)을 흡수하여 리치와 언데드 하수인들을 부리고 탑의 영혼을 굴복시킵니다.",
    difficulty: "매우 어려움 (★★★★)",
    style: "체력 소모 및 자원 관리, 언데드 하수인 소환 및 지속 피해, 디버프 및 고유 토큰 제어",
    recomCards: ["영혼 흡수", "무덤의 부름", "네크로틱 펄스"],
    color: "#9d4edd",
  },
];

export default function Characters() {
  const [activeTab, setActiveTab] = useState(CHARACTERS[0].id);
  const activeChar = CHARACTERS.find((c) => c.id === activeTab) || CHARACTERS[0];

  return (
    <section id="characters" className={styles.characters}>
      <div className={styles.container}>
        <div className={`${styles.header} reveal`}>
          <h2 className={styles.sectionTitle}>대표 직업 소개</h2>
          <p className={styles.sectionSubtitle}>
            플레이 스타일에 맞는 캐릭터를 선택해 보세요. 각 캐릭터는 완전히 독특한 카드 풀과 핵심 시스템을 가지고 있습니다.
          </p>
        </div>

        <div className={`${styles.contentWrapper} reveal`}>
          {/* Tab Menu */}
          <div className={styles.tabMenu}>
            {CHARACTERS.map((char) => (
              <button
                key={char.id}
                onClick={() => setActiveTab(char.id)}
                className={`${styles.tabBtn} ${activeTab === char.id ? styles.activeTab : ""}`}
                style={{
                  "--active-border": char.color,
                } as React.CSSProperties}
              >
                <span className={styles.tabName}>{char.name}</span>
                <span className={styles.tabSub}>{char.englishName}</span>
              </button>
            ))}
          </div>

          {/* Tab Panel */}
          <div className={styles.tabPanel}>
            <div className={styles.panelHeader}>
              <h3 className={styles.charTitle} style={{ color: activeChar.color }}>
                {activeChar.name} <span className={styles.charEng}>{activeChar.englishName}</span>
              </h3>
              <span className={styles.difficultyBadge}>{activeChar.difficulty}</span>
            </div>
            
            <p className={styles.charDesc}>{activeChar.description}</p>
            
            <div className={styles.detailGrid}>
              <div className={styles.detailBox}>
                <h4 className={styles.detailTitle}>주요 플레이 스타일</h4>
                <p className={styles.detailText}>{activeChar.style}</p>
              </div>
              
              <div className={styles.detailBox}>
                <h4 className={styles.detailTitle}>대표 추천 카드</h4>
                <ul className={styles.cardList}>
                  {activeChar.recomCards.map((card, index) => (
                    <li key={index} className={styles.cardItem}>
                      <span className={styles.cardBullet} style={{ backgroundColor: activeChar.color }}></span>
                      {card}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
