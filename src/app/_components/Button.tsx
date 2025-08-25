/**
 * Button
 * - variant(색/의미)와 shape(형태)로 조합하는 캡슐/원형 버튼
 *
 * @example
 * <Button variant="emptyAdd"><Plus size={20}/> 추가하기</Button>
 * <Button variant="delete"><X size={18}/> 삭제하기</Button>
 * <Button variant="revise"><Check size={18}/> 수정 완료</Button>
 * <Button variant="normal"><Check size={18}/> 수정 완료</Button>
 *
 * @example
 * // 아이콘 전용 형태
 * <Button shape="circle" size={56}><Plus size={24}/></Button>
 * <Button shape="miniPill"><Plus size={16}/></Button>
 */

'use client';

import styles from '@styles/Button.module.css';
import { ButtonHTMLAttributes, ReactNode } from 'react';

/** 버튼 의미/색상 프리셋 */
type Variant = 'emptyAdd' | 'delete' | 'revise' | 'normal';
/** 버튼 형태 프리셋 */
type Shape   = 'pill' | 'circle' | 'miniPill';
/** circle 전용 크기 프리셋(px) */
type CircleSize = 40 | 48 | 56 | 64;

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;     // 색/의미
  shape?: Shape;         // 형태
  size?: CircleSize;     // shape="circle"일 때만 사용
  className?: string;
  children: ReactNode;
}

const circleSizeClassMap: Record<CircleSize, string> = {
  40: styles.s40,
  48: styles.s48,
  56: styles.s56,
  64: styles.s64,
};

export default function Button({
  variant = 'normal',
  shape = 'pill',
  size = 56,
  className = '',
  children,
  ...props
}: Props) {
  const sizeClass = shape === 'circle' ? circleSizeClassMap[size] : undefined;

  const cls = [
    styles.btn,
    styles[variant],
    shape === 'circle'   && styles.circle,
    shape === 'miniPill' && styles.miniPill,
    sizeClass,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}