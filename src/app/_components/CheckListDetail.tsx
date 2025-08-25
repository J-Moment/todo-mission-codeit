/**
 * CheckListDetail
 * - 선택한 체크 아이템의 상세/메모/액션을 담는 상단 행(라벨 + 체크)
 *
 * @example
 * <CheckListDetail
 *   label="커피 사오기"
 *   checked={true}
 *   onToggle={(next) => console.log(next)}
 *   width={996}
 * />
 */

'use client';

import ToggleCheck from './CheckToggle';
import styles from '@/styles/CheckListDetail.module.css';

type Props = {
    /** 아이템 라벨 */
    label: string;
    checked: boolean;
    /** 토글 핸들러 */
    onToggle: (next: boolean) => void;
    width?: number | string;
    className?: string;
};

export default function CheckListDetail({
    label,
    checked,
    onToggle,
    width = '100%',
    className = '',
}: Props) {
    /**  기본 행 + 상태 + 외부 클래스 */
    const cls = [styles.row, checked && styles.on, className].filter(Boolean).join(' ');

    return (
        <div
            role="checkbox"
            aria-checked={checked}
            tabIndex={0}
            className={cls}
            style={{ width }}
            onClick={() => onToggle(!checked)}
            onKeyDown={(e) => {
                // Space/Enter로 키보드 토글 지원(접근성)
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    onToggle(!checked);
                }
            }}
        >
            <div className={styles.center}>
                <ToggleCheck checked={checked} onChange={onToggle} size={32} />
                <span className={styles.label}>{label}</span>
            </div>
        </div>
    );
}