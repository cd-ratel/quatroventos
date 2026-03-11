'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import styles from './midia.module.css';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  category: string;
  caption: string | null;
}

const categories = [
  { value: 'gallery', label: 'Galeria' },
  { value: 'venue', label: 'Espaço' },
  { value: 'wedding', label: 'Casamento' },
  { value: 'children', label: 'Festa Infantil' },
  { value: 'corporate', label: 'Corporativo' },
  { value: 'decoration', label: 'Decoração' },
];

export default function MidiaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [category, setCategory] = useState('gallery');
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      setMedia(data);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const uploadFiles = async (files: FileList | File[]) => {
    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append('files', f));
    formData.append('category', category);

    try {
      await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });
      fetchMedia();
    } catch {
      // silent
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const deleteMedia = async (id: string) => {
    if (!confirm('Excluir esta mídia?')) return;
    try {
      await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
      fetchMedia();
    } catch {
      // silent
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      <h1 className={styles.title}>Gerenciador de Mídia</h1>
      <p className={styles.subtitle}>{media.length} arquivo{media.length !== 1 ? 's' : ''}</p>

      {/* Upload Zone */}
      <div
        className={`${styles.uploadZone} ${dragOver ? styles.dragOver : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,video/*"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        {uploading ? (
          <>
            <span className="spinner" />
            <p>Enviando...</p>
          </>
        ) : (
          <>
            <span className={styles.uploadIcon}>📸</span>
            <p className={styles.uploadText}>
              Arraste imagens/vídeos aqui ou <strong>clique para selecionar</strong>
            </p>
            <p className={styles.uploadHint}>Máx. 50MB por arquivo • JPG, PNG, MP4, MOV</p>
          </>
        )}
      </div>

      {/* Category selector */}
      <div className={styles.categoryRow}>
        <span className={styles.categoryLabel}>Categoria para upload:</span>
        <div className={styles.categoryBtns}>
          {categories.map((c) => (
            <button
              key={c.value}
              className={`${styles.categoryBtn} ${category === c.value ? styles.active : ''}`}
              onClick={() => setCategory(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {media.length > 0 ? (
        <div className={styles.mediaGrid}>
          {media.map((item) => (
            <div key={item.id} className={styles.mediaCard}>
              <div className={styles.mediaPreview}>
                {item.mimeType.startsWith('image/') ? (
                  <Image
                    src={`/uploads/${item.filename}`}
                    alt={item.caption || item.originalName}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="200px"
                  />
                ) : (
                  <div className={styles.videoPlaceholder}>🎬</div>
                )}
              </div>
              <div className={styles.mediaInfo}>
                <div className={styles.mediaName}>{item.originalName}</div>
                <div className={styles.mediaMeta}>
                  {formatSize(item.size)} • {item.category}
                </div>
              </div>
              <button
                className={styles.mediaDelete}
                onClick={() => deleteMedia(item.id)}
                title="Excluir"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <span>📂</span>
          <p>Nenhuma mídia cadastrada</p>
          <p className={styles.emptyHint}>Use a área acima para fazer upload de imagens e vídeos do salão</p>
        </div>
      )}
    </>
  );
}
