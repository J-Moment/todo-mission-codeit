/**
 * CheckList
 * - 토글 가능한 체크 아이템 리스트
 *
 * @example
 * const [items, setItems] = useState<CheckItem[]>([
 *   { id: '1', label: '운동하기', checked: false },
 *   { id: '2', label: '커피사기', checked: true  },
 * ]);
 * const onToggle = (id: string, next: boolean) =>
 *   setItems(prev => prev.map(it => it.id===id ? { ...it, checked: next } : it));
 * <CheckList items={items} onToggle={onToggle} />
 */

'use client';

import ToggleCheck from './CheckToggle';
import styles from '@/styles/CheckList.module.css';

/** 한 줄 체크 아이템 스키마 */
export type CheckItem = {
    id: string;
    label: string;
    checked: boolean;
};

type Props = {
    /** 렌더링할 아이템 배열 */
    items: CheckItem[];
    onToggle: (id: string, next: boolean) => void;
    className?: string;
};

export default function CheckList({ items, onToggle, className = '' }: Props) {
    /** 모듈 + 외부 클래스 */
    const cls = [styles.list, className].filter(Boolean).join(' ');

    return (
        <ul className={cls}>
            {items.map(({ id, label, checked }) => (
                <li key={id}>
                    <div
                        role="checkbox"
                        aria-checked={checked}
                        tabIndex={0}
                        className={[styles.item, checked && styles.on].filter(Boolean).join(' ')}
                        onClick={() => onToggle(id, !checked)}
                        onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                                e.preventDefault();
                                onToggle(id, !checked);
                            }
                        }}
                    >
                        <span className={styles.icon} onClick={(e) => e.stopPropagation()}>
                            <ToggleCheck
                                checked={checked}
                                onChange={(v) => onToggle(id, v)}
                                size={32}
                            />
                        </span>

                        {/* 텍스트 넘쳤을 경우 처리 */}
                        <span className={styles.label}>{label}</span>
                    </div>
                </li>
            ))}
        </ul>
    );
}