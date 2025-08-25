/**
 * MiniButton
 *
 * @example
 * <MiniButton variant="light" size={64}><Plus size={24}/></MiniButton>
 * <MiniButton variant="dark"  size={56}><Pen  size={20}/></MiniButton>
 */

'use client';

import styles from '@styles/MiniButton.module.css';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'light' | 'dark';
type Size = 56 | 64;

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    className?: string;
    children: ReactNode;
}

export default function MiniButton({
    variant = 'light',
    size = 64,
    className = '',
    children,
    ...props
}: Props) {
    const sizeClass = size === 56 ? styles.s56 : styles.s64;

    const cls = [styles.btn, styles[variant], sizeClass, className]
        .filter(Boolean)
        .join(' ');

    return (
        <button className={cls} {...props}>
            {children}
        </button>
    );
}
