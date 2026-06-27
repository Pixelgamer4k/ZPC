import type { CSSProperties, ReactNode } from 'react';
import styles from './ui.module.css';

export function Card({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`${styles.card} ${className ?? ''}`} style={style}>
      {children}
    </div>
  );
}

export function Badge({
  label,
  color = 'var(--color-primary)',
}: {
  label: string;
  color?: string;
}) {
  return (
    <span
      className={styles.badge}
      style={{ color, background: `${color}22` }}
    >
      {label}
    </span>
  );
}

export function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className={styles.sectionHeader}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {action && onAction && (
        <button type="button" className={styles.sectionAction} onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}

export function ProgressBar({
  progress,
  color = 'var(--color-primary)',
}: {
  progress: number;
  color?: string;
}) {
  return (
    <div className={styles.progressTrack} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <div className={styles.progressFill} style={{ width: `${Math.min(100, Math.max(0, progress))}%`, background: color }} />
    </div>
  );
}

export function MetricTile({
  label,
  value,
  subtext,
  accent = 'var(--color-primary)',
}: {
  label: string;
  value: string;
  subtext?: string;
  accent?: string;
}) {
  return (
    <div className={styles.metricTile}>
      <div className={styles.metricLabel}>{label}</div>
      <div className={styles.metricValue} style={{ color: accent }}>{value}</div>
      {subtext && <div className={styles.metricSubtext}>{subtext}</div>}
    </div>
  );
}

export { styles as ui };
