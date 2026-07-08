import React from "react";
import styles from "./Tips.module.css";

const TIPS = [
  {
    tag: "공격 & 수비",
    title: "방어 없는 공격은 죽음뿐",
    desc: "잃어버린 체력은 쉽게 회복되지 않습니다. 적의 머리 위에 표시되는 행동 의도(Intent)를 먼저 확인하고, 강력한 적의 대미지를 완전히 흡수할 만큼 수비 카드를 충분히 배치하세요.",
  },
  {
    tag: "덱 관리",
    title: "덱 다이어트는 선택이 아닌 필수",
    desc: "모든 보상 카드를 다 고르는 것은 하책입니다. 불필요한 기본 타격/수비 카드는 상점이나 이벤트를 통해 꾸준히 삭제하여, 핵심 카드가 매 턴 자주 드로우될 수 있도록 덱을 압축하세요.",
  },
  {
    tag: "유물 & 시너지",
    title: "유물의 패시브 조건에 맞추기",
    desc: "유물은 매 턴 공짜 혜택을 주는 강력한 열쇠입니다. 새로운 카드를 집을 때, 내 덱의 카드보다 현재 가지고 있는 유물과의 연계성(예: 소멸 시 드로우, 특정 턴 공격 증가 등)을 최우선으로 고려하세요.",
  },
  {
    tag: "지도 계획",
    title: "경로 탐색과 엘리트 사냥",
    desc: "길을 정할 때 모닥불(Rest Site)과 상점, 엘리트의 배치를 확인하세요. 특히 엘리트는 체력을 잃을 위험이 크지만 영구적인 유물과 고등급 카드를 주기 때문에 등반력을 올리는 지름길입니다.",
  },
];

export default function Tips() {
  return (
    <section id="tips" className={styles.tips}>
      <div className={styles.container}>
        <div className={`${styles.header} reveal`}>
          <h2 className={styles.sectionTitle}>초보자를 위한 실전 팁</h2>
          <p className={styles.sectionSubtitle}>
            스파이어의 고수들이 매 등반마다 의식적으로 실천하는 4가지 플레이 전략입니다.
          </p>
        </div>

        <div className={styles.grid}>
          {TIPS.map((tip, idx) => (
            <div 
              key={idx} 
              className={`${styles.card} reveal reveal-delay-${idx + 1}`}
            >
              <span className={styles.cardTag}>{tip.tag}</span>
              <h3 className={styles.cardTitle}>{tip.title}</h3>
              <p className={styles.cardDesc}>{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
