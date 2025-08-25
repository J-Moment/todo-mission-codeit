/**
 * ToggleCheck
 * - 정원(가변 크기)의 온/오프 체크 토글 버튼
 *
 * @example
 * const [checked, setChecked] = useState(false);
 * <ToggleCheck checked={checked} onChange={setChecked} size={32} />
 */

'use client';
import styles from '@/styles/CheckToggle.module.css';

type Props = {
  /** 현재 체크 상태 */
  checked: boolean;
  /** 상태 토글 콜백 */
  onChange: (next: boolean) => void;
  /** 한 변 길이가 변수 --s로 전달되어 width/height에 사용 */
  size?: number;
};

export default function CheckToggle({
  checked,
  onChange,
  size = 32,
}: Props
) {
  return (
    <button
      className={styles.wrap}
      /* CSS 변수 --s에 픽셀 값 주입 → .wrap { width/height: var(--s) } */
      style={{ ['--s' as any]: `${size}px` }}
      onClick={() => onChange(!checked)}
    >
      {checked ? (
        /* 체크 상태 */
        <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="var(--violet-600)" />
          <path
            d="M8 16.2857L13.8182 22L24 12"
            stroke="#FEFCE8"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        /* 체크 안된 상태 */
        <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="15" fill="#FEFCE8" stroke="var(--slate-900)" strokeWidth="2" />
        </svg>
      )}
    </button>
  );
}