'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Hammer } from 'lucide-react';
import Delaunator from 'delaunator';
import { supabase } from '@/utils/supabase';
import styles from './post.module.css';

const mockPosts = {
  '1': { id: '1', title: '월요일 아침의 피곤함', image_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&h=800&fit=crop', hit_count: 124 },
  '2': { id: '2', title: '야근 후 먹는 라면', image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=800&fit=crop', hit_count: 56 },
  '3': { id: '3', title: '스트레스 받는 회의', image_url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=800&fit=crop', hit_count: 320 },
  '4': { id: '4', title: '에러 터진 내 코드', image_url: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&h=800&fit=crop', hit_count: 890 },
};

type Shard = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angularVelocity: number;
  points: { x: number, y: number }[]; // 상대 좌표 (centroid 기준)
  centroid: { x: number, y: number }; // 원본에서의 절대 좌표
  active: boolean;
};

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const post = id ? mockPosts[id as keyof typeof mockPosts] : null;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [smashed, setSmashed] = useState(false);
  const [hitCount, setHitCount] = useState(post?.hit_count || 0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const shardsRef = useRef<Shard[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // 세션 체크 (로그인 여부)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    if (!post) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = post.image_url;

    img.onload = () => {
      imgRef.current = img;
      const rect = container.getBoundingClientRect();
      const canvasSize = Math.min(rect.width, rect.height, 600);
      canvas.width = canvasSize;
      canvas.height = canvasSize;

      // 처음에 멀쩡한 사진 그리기
      ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
    };

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [post]);

  const createShards = (canvasSize: number, clickX: number, clickY: number) => {
    const points: number[][] = [];
    
    // 테두리 포인트
    for (let i = 0; i <= canvasSize; i += canvasSize / 4) {
      points.push([i, 0], [i, canvasSize], [0, i], [canvasSize, i]);
    }

    // 클릭 지점 근처에 많은 포인트 생성 (조밀하게 깨지도록)
    for (let i = 0; i < 80; i++) {
      const radius = Math.random() * (canvasSize / 2);
      const angle = Math.random() * Math.PI * 2;
      // 중심에서 멀어질수록 덜 생성되도록 제곱
      const r = Math.pow(Math.random(), 2) * canvasSize * 0.8; 
      
      const px = clickX + Math.cos(angle) * r;
      const py = clickY + Math.sin(angle) * r;

      if (px >= 0 && px <= canvasSize && py >= 0 && py <= canvasSize) {
        points.push([px, py]);
      }
    }

    // 화면 전반적으로 무작위 포인트
    for (let i = 0; i < 50; i++) {
      points.push([Math.random() * canvasSize, Math.random() * canvasSize]);
    }

    // 클릭 지점 자체 추가
    points.push([clickX, clickY]);

    const delaunay = Delaunator.from(points);
    const triangles = delaunay.triangles;
    
    const newShards: Shard[] = [];

    for (let i = 0; i < triangles.length; i += 3) {
      const p1 = points[triangles[i]];
      const p2 = points[triangles[i + 1]];
      const p3 = points[triangles[i + 2]];

      const cx = (p1[0] + p2[0] + p3[0]) / 3;
      const cy = (p1[1] + p2[1] + p3[1]) / 3;

      newShards.push({
        x: cx,
        y: cy,
        vx: 0,
        vy: 0,
        angle: 0,
        angularVelocity: 0,
        centroid: { x: cx, y: cy },
        points: [
          { x: p1[0] - cx, y: p1[1] - cy },
          { x: p2[0] - cx, y: p2[1] - cy },
          { x: p3[0] - cx, y: p3[1] - cy }
        ],
        active: false // active means "is falling"
      });
    }

    return newShards;
  };

  const handleSmash = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (isLoggedIn) {
      setHitCount(prev => prev + 1);
    }

    if (!smashed) {
      setSmashed(true);
      shardsRef.current = createShards(canvas.width, canvas.width / 2, canvas.height / 2);
      
      let lastTime = performance.now();
      
      const render = (time: number) => {
        const dt = (Math.min(time - lastTime, 100)) / 1000;
        lastTime = time;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const gravity = 1500;
        let anyFalling = false;

        shardsRef.current.forEach(shard => {
          if (shard.active) {
            anyFalling = true;
            shard.vy += gravity * dt;
            shard.x += shard.vx * dt;
            shard.y += shard.vy * dt;
            shard.angle += shard.angularVelocity * dt;

            // Stop calculating if it's way below the screen
            if (shard.y > canvas.height + 500) {
              return;
            }
          }

          ctx.save();
          ctx.translate(shard.x, shard.y);
          ctx.rotate(shard.angle);

          ctx.beginPath();
          ctx.moveTo(shard.points[0].x, shard.points[0].y);
          ctx.lineTo(shard.points[1].x, shard.points[1].y);
          ctx.lineTo(shard.points[2].x, shard.points[2].y);
          ctx.closePath();

          ctx.clip();

          ctx.translate(-shard.centroid.x, -shard.centroid.y);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          ctx.restore();
        });

        // Continue rendering to process falling pieces
        animationRef.current = requestAnimationFrame(render);
      };

      animationRef.current = requestAnimationFrame(render);
    }

    // 타격 범위 반경 (이 반경 내의 조각들만 깨지고 떨어짐)
    const smashRadius = 150; 
    
    // 클릭한 위치 주변의 조각들 활성화 (떨어지게 만들기)
    shardsRef.current.forEach(shard => {
      const dx = shard.centroid.x - clickX;
      const dy = shard.centroid.y - clickY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < smashRadius) {
        shard.active = true;
        
        // 클릭 지점에서 바깥으로 폭발하는 힘
        const force = Math.min(1000 / (dist + 10), 500);
        shard.vx += (dx / dist) * force * (Math.random() * 0.5 + 0.5);
        shard.vy += (dy / dist) * force * (Math.random() * 0.5 + 0.5) - 200; // 살짝 위로 튀어오름
        shard.angularVelocity += (Math.random() - 0.5) * 15;
      }
    });
  };

  const resetImage = () => {
    setSmashed(false);
    shardsRef.current = [];
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  };

  if (!post) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <ArrowLeft size={20} />
          돌아가기
        </button>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.stats}>
          <Hammer size={20} className={styles.dangerIcon} />
          <span>{hitCount.toLocaleString()} Hits</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.frameWrapper} ref={containerRef}>
          <div className={styles.frame}>
            <canvas 
              ref={canvasRef} 
              className={styles.canvas}
              onClick={handleSmash}
            />
            {!smashed && (
              <div className={styles.instruction}>
                사진을 클릭하여 망치로 내리치세요!
              </div>
            )}
            {smashed && (
              <button className={styles.resetBtn} onClick={resetImage}>
                사진 복구하기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
