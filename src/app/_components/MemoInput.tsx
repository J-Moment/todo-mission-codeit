/**
 * MemoInput
 * - 줄선 배경 + 중앙 타이틀이 있는 메모 입력(텍스트 한 줄을 수평/수직 중앙 배치)
 *
 * @example
 * <MemoInput width={696} height={426} placeholder="오늘의 할 일…" />
 * <MemoInput full title="Memo" placeholder="내용을 입력하세요" />
 */

'use client';
import styles from '@/styles/MemoInput.module.css';

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  width?: number | string;
  height?: number | string;
  /** 부모 컨테이너 채우기 */
  full?: boolean;
  /** MeMo 타이틀 텍스트 */
  title?: string;
};

export default function MemoInput({
  width,
  height,
  full,
  title = 'Memo',
  className = 'text-16r',
  ...rest
}: Props) {
  return (
    <div
      /* 전체 박스(배경/줄선/타이틀) */
      className={[styles.wrap, full && styles.full].filter(Boolean).join(' ')}
      style={{ width, height }}
    >
      <div className={styles.title}>{title}</div>

      {/* 메모 */}
      <textarea
        className={[styles.area, className].filter(Boolean).join(' ')}
        {...rest}
      />
    </div>
  );
}