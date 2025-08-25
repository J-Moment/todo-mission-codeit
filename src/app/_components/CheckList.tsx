/**
 * CheckList
 *
 * @example
 * <CheckList
 *   items={[{id:'1',label:'운동',checked:false}]}
 *   onToggle={(id,next)=>{...}}
 *   onLabelClick={(item)=> router.push(`/detail/${item.id}?label=${item.label}`)}
 * />
 */

'use client';

import ToggleCheck from './CheckToggle';
import styles from '@/styles/CheckList.module.css';

export type CheckItem = { id: string; label: string; checked: boolean };

type Props = {
  /** 렌더링할 아이템 배열 */
  items: CheckItem[];
  onToggle: (id: string, next: boolean) => void;
  /** 라벨 클릭 콜백(상세 이동 등) */
  onLabelClick?: (item: CheckItem) => void;
  className?: string;
};

export default function CheckList({ items, onToggle, onLabelClick, className = '' }: Props) {
  const cls = [styles.list, className].filter(Boolean).join(' ');

  return (
    <ul className={cls}>
      {items.map((it) => (
        <li key={it.id}>
          {/* li를 체크박스처럼 작동 */}
          <div
            role="checkbox"
            aria-checked={it.checked}
            tabIndex={0}
            className={[styles.item, it.checked && styles.on].filter(Boolean).join(' ')}
            onClick={() => onToggle(it.id, !it.checked)}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onToggle(it.id, !it.checked);
              }
            }}
          >
            {/* 토글과 부모 구분 */}
            <span className={styles.icon} onClick={(e) => e.stopPropagation()}>
              <ToggleCheck checked={it.checked} onChange={(v) => onToggle(it.id, v)} size={32} />
            </span>

            {/* 라벨 => 상세 이동 */}
            <span
              className={`${styles.label} text-16r`}
              onClick={(e) => {
                e.stopPropagation();
                onLabelClick?.(it);
              }}
            >
              {it.label}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}