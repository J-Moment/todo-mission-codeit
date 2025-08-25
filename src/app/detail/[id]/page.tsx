/**
 * DetailPage
 * - 타이틀 바: 체크 + 라벨(클릭 시 인라인 편집)
 * - 본문: 이미지 + 메모 2열 → 모바일 1열
 * - 하단: 수정 완료(체크 여부에 따라 색상), 삭제하기
 * - 이미지 업로드 5MB 제한
 *
 * URL: /detail/[id]?label=...&checked=0|1
 */

'use client';

import { useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';

import styles from '@/styles/DetailPage.module.css';

import ToggleCheck from '@/app/_components/CheckToggle';
import MemoInput from '@/app/_components/MemoInput';
import Button from '@/app/_components/Button';

import Plus from '@/icons/Plus';
import Pen from '@/icons/Pen';
import Check from '@/icons/Check';
import X from '@/icons/X';

export default function DetailPage() {
    const { id } = useParams<{ id: string }>();
    const q = useSearchParams();

    const initialLabel = q.get('label') ?? '할 일 제목';
    const initialChecked = q.get('checked') === '1';

    const [label, setLabel] = useState(initialLabel);
    const [checked, setChecked] = useState(initialChecked);
    const [memo, setMemo] = useState('');
    const [img, setImg] = useState<string | null>(null);

    // 제목 인라인 편집
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(initialLabel);
    const commitTitle = () => {
        const v = draft.trim();
        if (v) setLabel(v);
        setEditing(false);
    };

    // 이미지 업로드(5MB 제한)
    const fileRef = useRef<HTMLInputElement>(null);
    const pickImage = () => fileRef.current?.click();
    const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (f.size > 5 * 1024 * 1024) {
            alert('이미지는 5MB 이하만 업로드할 수 있어요.');
            e.currentTarget.value = '';
            return;
        }
        const url = URL.createObjectURL(f);
        setImg(url);
    };

    const active = useMemo(() => checked || !!memo.trim() || !!img, [checked, memo, img]);

    return (
        <main className={styles.page}>
            <div className={styles.inner}>
                {/* 제목 */}
                <div className={`${styles.titleRow} ${checked ? styles.titleChecked : ''}`}>
                    <span className={styles.check}>
                        <ToggleCheck checked={checked} onChange={setChecked} size={32} />
                    </span>

                    {!editing ? (
                        <button
                            type="button"
                            className={`${styles.titleLabel} text-16r`}
                            onClick={() => { setDraft(label); setEditing(true); }}
                            aria-label="제목 편집"
                            title={`ID: ${id}`}
                        >
                            {label}
                        </button>
                    ) : (
                        <div className={styles.titleEdit}>
                            <input
                                className={`${styles.titleInput} text-16r`}
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') commitTitle();
                                    if (e.key === 'Escape') setEditing(false);
                                }}
                                autoFocus
                            />
                        </div>
                    )}
                </div>

                {/* 본문 */}
                <section className={styles.content}>
                    {/* 이미지 */}
                    <div className={styles.imagePanel}>
                        <div className={`${styles.imageBox} ${img ? styles.hasImage : ''}`}>
                            {img ? (
                                <img
                                    src={img}
                                    alt=""
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 24 }}
                                />
                            ) : (
                                <div className={styles.placeholder}>
                                    <Image src="/icons/emptyImage.svg" alt="" width={64} height={64} />
                                </div>
                            )}

                            <div className={styles.addImageBtn}>
                                <Button
                                    shape="circle"
                                    size={64}
                                    className={styles.penBtn}
                                    aria-label={img ? '이미지 수정' : '이미지 추가'}
                                    onClick={pickImage}
                                >
                                    {img ? <Pen size={24} /> : <Plus size={24} />}
                                </Button>
                            </div>
                            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
                        </div>
                    </div>

                    {/* 메모 */}
                    <div className={styles.memoPanel}>
                        <MemoInput
                            title="Memo"
                            width={588}
                            height={311}
                            placeholder="오메가 3, 프로폴리스, 아연 챙겨먹기"
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            className="text-16r"
                        />
                    </div>
                </section>

                {/* 하단 */}
                <div className={styles.actions}>
                    <Button variant={checked ? 'revise' : 'normal'} className="text-16b" onClick={() => alert('수정 완료')}>
                        <Check size={18} /> 수정 완료
                    </Button>
                    <Button variant="delete" className="text-16b" onClick={() => alert('삭제하기')}>
                        <X size={16} /> 삭제하기
                    </Button>
                </div>
            </div>
        </main>
    );
}