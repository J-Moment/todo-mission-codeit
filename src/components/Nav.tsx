`use client`;
import Link from 'next/link';
import Image from 'next/image';
import styles from '@styles/Nav.module.css';

export default function Nav() {
    return (
        <nav className={styles.nav}>
            <Link href="/" className='styles.logo'>
                <Image src='/icons/logoLarge.svg' alt="Logo" width={151}
                    height={40} />
            </Link>
        </nav>
    );
}