'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from '@styles/Nav.module.css';

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/">
          {/* 데스크탑/태블릿 */}
          <Image
            src="/icons/logoLarge.svg"
            alt="do it;"
            width={151}
            height={40}
            priority
            className={styles.logoLarge}
          />
          {/* 모바일 */}
          <Image
            src="/icons/logoSmall.svg"
            alt="do it"
            width={71}
            height={40}
            priority
            className={styles.logoSmall}
          />
        </Link>
      </div>
    </nav>
  );
}
