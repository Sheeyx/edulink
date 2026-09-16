import styles from "./Loader.module.css";

export interface LoaderProps {
  /** Up to 3 rotating status messages shown beneath the animation. */
  messages?: string[];
  /** When true (default), the loader fills the viewport and is centered. */
  fullScreen?: boolean;
}

const DEFAULT_MESSAGES = [
  "Opening your books…",
  "Sharpening pencils…",
  "Preparing your lessons…",
];

export default function Loader({
  messages = DEFAULT_MESSAGES,
  fullScreen = true,
}: LoaderProps) {
  const displayMessages = messages.slice(0, 3);

  const loader = (
    <div
      className={styles.loader}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className={styles.scene} aria-hidden="true">
        <div className={styles.book}>
          <div className={`${styles.cover} ${styles.coverLeft}`} />
          <div className={`${styles.cover} ${styles.coverRight}`} />

          <div className={`${styles.page} ${styles.pageLeft}`} />
          <div className={`${styles.page} ${styles.pageRight}`}>
            <span className={styles.highlightStroke} />
          </div>

          <div className={`${styles.flipPage} ${styles.flipPage1}`} />
          <div className={`${styles.flipPage} ${styles.flipPage2}`} />
          <div className={`${styles.flipPage} ${styles.flipPage3}`} />
        </div>

        <div className={styles.shadow} />
      </div>

      <div className={styles.messages} aria-hidden="true">
        {displayMessages.map((message, index) => (
          <span
            key={index}
            className={styles.message}
            style={{ animationDelay: `${index * 2.4}s` }}
          >
            {message}
          </span>
        ))}
      </div>

      <div className={styles.progressTrack} aria-hidden="true">
        <div className={styles.progressBar} />
      </div>
    </div>
  );

  if (!fullScreen) return loader;

  return <div className={styles.fullScreen}>{loader}</div>;
}
