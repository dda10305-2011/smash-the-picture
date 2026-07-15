import Link from 'next/link';
import styles from './page.module.css';
import { Hammer } from 'lucide-react';
import { supabase } from '@/utils/supabase';

// DB에서 데이터 가져오기 (Next.js 15 App Router의 경우 async 컴포넌트로 처리 가능)
export default async function Home() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
  }

  const displayPosts = posts && posts.length > 0 ? posts : [];

  return (
    <div className={styles.main}>
      <header className={styles.hero}>
        <h1 className={styles.title}>부수고 싶은 사진이 있나요?</h1>
        <p className={styles.subtitle}>마음에 안 드는 사진을 올리고 망치로 산산조각 내보세요. 스트레스가 확 풀릴 거예요!</p>
      </header>

      <section className={styles.grid}>
        {displayPosts.map((post) => (
          <Link href={`/post/${post.id}`} key={post.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              {/* 실제 서비스에서는 next/image를 최적화하여 사용 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image_url} alt={post.title} className={styles.image} />
              <div className={styles.overlay}>
                <Hammer size={32} className={styles.hammerIcon} />
                <span>부수러 가기</span>
              </div>
            </div>
            <div className={styles.cardInfo}>
              <h3 className={styles.cardTitle}>{post.title}</h3>
              <div className={styles.hitCount}>
                <Hammer size={16} />
                <span>{post.hit_count.toLocaleString()} hits</span>
              </div>
            </div>
          </Link>
        ))}
        {displayPosts.length === 0 && (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '50px', color: '#888' }}>
            <p>아직 등록된 타겟이 없습니다. 첫 번째 타겟을 올려보세요!</p>
          </div>
        )}
      </section>
    </div>
  );
}
