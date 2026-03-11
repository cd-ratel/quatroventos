import styles from './VisualPlaceholder.module.css';

export default function VisualPlaceholder({
  label,
  title,
  description,
  compact = false,
}: {
  label: string;
  title: string;
  description?: string;
  compact?: boolean;
}) {
  return (
    <div className={`${styles.placeholder} ${compact ? styles.compact : ''}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.mark}>QV</span>
      <div className={styles.content}>
        <strong>{title}</strong>
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  );
}
