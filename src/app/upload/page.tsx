'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, Loader2 } from 'lucide-react';
import styles from './upload.module.css';

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setLoading(true);

    try {
      const { supabase } = await import('@/utils/supabase');
      
      // 사용자 인증 확인
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('로그인이 필요합니다.');
        router.push('/login');
        return;
      }

      // 1. Storage에 이미지 업로드
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 이미지 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // 2. DB에 데이터 저장
      const { error: dbError } = await supabase
        .from('posts')
        .insert([
          { 
            title, 
            image_url: publicUrl, 
            hit_count: 0,
            user_id: session.user.id
          }
        ]);

      if (dbError) throw dbError;

      alert('업로드 완료!');
      router.push('/');
    } catch (error: any) {
      console.error(error);
      alert('업로드 중 오류가 발생했습니다: ' + (error.message || '알 수 없는 오류'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>새로운 타겟 올리기</h1>
      <p className={styles.subtitle}>부수고 싶은 사진과 사연을 올려주세요.</p>

      <form onSubmit={handleSubmit} className={`glass-panel ${styles.form}`}>
        <div className={styles.formGroup}>
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 월요일 아침 출근길"
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label>사진</label>
          <div className={styles.uploadArea}>
            {preview ? (
              <div className={styles.previewContainer}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Preview" className={styles.preview} />
                <button 
                  type="button" 
                  onClick={() => { setFile(null); setPreview(null); }}
                  className={styles.changeBtn}
                >
                  다른 사진 선택
                </button>
              </div>
            ) : (
              <label htmlFor="file-upload" className={styles.uploadLabel}>
                <ImagePlus size={48} className={styles.uploadIcon} />
                <span>클릭하여 사진 선택</span>
                <span className={styles.uploadHint}>JPG, PNG (최대 5MB)</span>
              </label>
            )}
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.fileInput}
              required={!file}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={!file || !title || loading} 
          className={styles.submitBtn}
        >
          {loading ? (
            <>
              <Loader2 className={styles.spinner} size={20} />
              업로드 중...
            </>
          ) : (
            '업로드 하기'
          )}
        </button>
      </form>
    </div>
  );
}
