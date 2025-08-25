/**
 * AddToDoInput
 * 
 * @example
 * <AddToDoInput placeholder="할 일을 입력해주세요" width={800} />
 * <AddToDoInput placeholder="검색…" full />
 */

'use client';

import { InputHTMLAttributes } from 'react';
import styles from '@styles/AddToDoInput.module.css';

/*
Props 타입 정의
- InputHTMLAttributes<HTMLInputElement> 상속
- width: 입력 필드 너비 px 단위
- full: true이면 부모 컨테이너 너비 100% 차지
*/

type Props = InputHTMLAttributes<HTMLInputElement> & {
  width?: number;
  full?: boolean;
};

export default function AddToDoInput({
  width,
  full,
  className = '',
  ...rest
}: Props) {
  // 래퍼 클래스: 화면의 full 여부와 외부 className 병합용
  const wrapCls = [styles.wrap, full && styles.full, className].filter(Boolean).join(' ');

  // full이 아닐 때만 width(px) 인라인 스타일로 고정
  const wrapStyle = !full && width ? { width } : undefined;

  return (
    <div className={wrapCls} style={wrapStyle}>
      <input className={`${styles.input} text-16r`} {...rest} />
    </div>
  );
}