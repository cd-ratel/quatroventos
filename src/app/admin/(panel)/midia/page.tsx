'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '@/app/admin/midia/midia.module.css';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  category: string;
  caption: string | null;
  url?: string;
}

const categories = [
  { value: 'gallery', label: 'Galeria' },
  { value: 'venue', label: 'Espaço' },
  { value: 'wedding', label: 'Casamento' },
  { value: 'children', label: 'Festa infantil' },
  { value: 'corporate', label: 'Corporativo' },
  { value: 'decoration', label: 'Decoração' },
];

export default function MidiaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [category, setCategory] = useState('gallery');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      const response = await fetch('/api/media');
      if (!response.ok) {
        throw new Error('Não foi possível carregar a mídia.');
      }
      const data = await response.json();
      setMedia(data);
      setError('');
    } catch {
      setError('Não foi possível carregar a mídia.');
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const uploadFiles = async (files: FileList | File[]) => {
    setUploading(true);
    setError('');
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));
    formData.append('category', category);

    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível enviar os arquivos.');
      }
      fetchMedia();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Não foi possível enviar os arquivos.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    if (event.dataTransfer.files.length > 0) {
      uploadFiles(event.dataTransfer.files);
    }
  };

  const deleteMedia = async (id: string) => {
    if (!confirm('Excluir esta mídia?')) {
      return;
    }

    try {
      const response = await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível excluir a mídia.');
      }
      fetchMedia();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Não foi possível excluir a mídia.'
      );
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <section className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h2>Biblioteca de mídia</h2>
          <p>{media.length} arquivo{media.length !== 1 ? 's' : ''} cadastrados</p>
        </div>
        {error ? <p className={styles.errorMessage}>{error}</p> : null}
      </div>

      <div
        className={`${styles.uploadZone} ${dragOver ? styles.uploadZoneActive : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.avif,.mp4,.webm"
          style={{ display: 'none' }}
          onChange={(event) => event.target.files && uploadFiles(event.target.files)}
        />

        {uploading ? (
          <>
            <span className="spinner" />
            <strong>Enviando arquivos</strong>
            <p>Aguarde a conclusão do upload.</p>
          </>
        ) : (
          <>
            <span className={styles.uploadIcon}>▣</span>
            <strong>Arraste imagens e vídeos ou clique para selecionar</strong>
            <p>Arquivos até 50 MB. Formatos aceitos: JPG, PNG, WebP, AVIF, MP4 e WebM.</p>
          </>
        )}
      </div>

      <div className={styles.categoryBar}>
        <span>Categoria do próximo upload</span>
        <div className={styles.categoryButtons}>
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`${styles.categoryButton} ${category === item.value ? styles.categoryButtonActive : ''}`}
              onClick={() => setCategory(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {media.length > 0 ? (
        <div className={styles.mediaGrid}>
          {media.map((item) => (
            <article key={item.id} className={styles.mediaCard}>
              <div className={styles.mediaPreview}>
                {item.mimeType.startsWith('image/') ? (
                  <img
                    src={item.url || `/media/${item.id}`}
                    alt={item.caption || item.originalName}
                    className={styles.mediaImage}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.videoPlaceholder}>Vídeo</div>
                )}
              </div>

              <div className={styles.mediaInfo}>
                <strong>{item.originalName}</strong>
                <span>{formatSize(item.size)} • {item.category}</span>
              </div>

              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => deleteMedia(item.id)}
              >
                Excluir
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <strong>Nenhuma mídia cadastrada</strong>
          <p>Use a área acima para enviar fotos e vídeos do salão.</p>
        </div>
      )}
    </section>
  );
}
