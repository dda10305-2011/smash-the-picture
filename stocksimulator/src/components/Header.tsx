'use client';

import Link from 'next/link';
import { Hammer } from 'lucide-react';
import styles from './Header.module.css';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 현재 세션 가져오기
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getSession();

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContent}`}>
        <Link href="/" className={styles.logo}>
          <Hammer className={styles.icon} size={28} />
          <h1>SmashPic</h1>
        </Link>
        <nav className={styles.nav}>
          <Link href="/upload" className={styles.uploadBtn}>사진 올리기</Link>
          {user ? (
            <button onClick={handleLogout} className={styles.loginBtn}>로그아웃</button>
          ) : (
            <Link href="/login" className={styles.loginBtn}>로그인</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
