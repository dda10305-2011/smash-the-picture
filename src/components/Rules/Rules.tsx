import React from "react";
import styles from "./Rules.module.css";

const BASIC_RULES = [
  {
    num: "01",
    title: "에너지와 행동 관리",
    desc: "매 턴 주어지는 에너지를 배분하여 최선의 행동을 취하세요. 적의 의도를 읽고 공격(Attack)과 수비(Defend) 중 무엇에 집중할지 판단하는 것이 첫걸음입니다.",
  },
  {
    num: "02",
    title: "덱 순환과 드로우 규칙",
    desc: "턴이 끝나면 사용하지 않은 손패는 모두 버려집니다. 매 턴 새로운 카드가 드로우되며, 덱이 모두 소진되면 버린 카드 더미를 새로 섞어 덱을 구성합니다.",
  },
  {
    num: "03",
    title: "유물 및 시너지 효과",
    desc: "엘리트 몬스터 처치나 상점 구매를 통해 영구 지속형 패시브 아이템인 '유물'을 얻습니다. 유물과 카드의 조합이 스파이어 등반의 성패를 가릅니다.",
  },
];

export default function Rules() {
  return (
    <section id="rules" className={styles.rules}>
      <div className={styles.container}>
        <div className={`${styles.header} reveal`}>
          <h2 className={styles.sectionTitle}>기초 규칙 요약</h2>
          <p className={styles.sectionSubtitle}>
            슬레이 더 스파이어 2의 전장에 진입하기 전 반드시 숙지해야 할 세 가지 핵심 메커니즘입니다.
          </p>
        </div>

        <div className={styles.grid}>
          {BASIC_RULES.map((rule, idx) => (
            <div 
              key={idx} 
              className={`${styles.card} reveal reveal-delay-${idx + 1}`}
            >
              <div className={styles.cardNumber}>{rule.num}</div>
              <h3 className={styles.cardTitle}>{rule.title}</h3>
              <p className={styles.cardDesc}>{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
