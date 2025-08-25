'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

import styles from '@/styles/DetailPage.module.css';
import ToggleCheck from '@/app/_components/CheckToggle';
import MemoInput from '@/app/_components/MemoInput';
import Button from '@/app/_components/Button';

import Plus from '@/icons/Plus';
import Pen from '@/icons/Pen';
import Check from '@/icons/Check';
import X from '@/icons/X';

import { getItem, updateItem, deleteItem, uploadImage, type Item } from '@/lib/api';

export default function DetailPage() {
    const router = useRouter();
    // URL 파라미터
    const { id } = useParams<{ id: string }>();
    // 쿼리
    const q = useSearchParams();

    // 데이터 상태
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Item | null>(null);

    //자동 저장 방지
    const [saving, setSaving] = useState(false);

    // 초기 조회
    useEffect(() => {
        (async () => {
            try {
                const item = await getItem(Number(id));
                setData(item);
            } catch (e: any) {
                // 실패
                setData({
                    id: Number(id),
                    tenantId: 'dsw03002',
                    name: q.get('label') ?? '할 일 제목',
                    memo: '',
                    imageUrl: null,
                    isCompleted: q.get('checked') === '1',
                });
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState('');

    useEffect(() => {
        if (data) setDraft(data.name);
    }, [data]);

    // 파일 업로드 input 관리
    const fileRef = useRef<HTMLInputElement>(null);
    const pickImage = () => fileRef.current?.click();

    // 업로드 처리
    const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputEl = e.currentTarget;
        const f = inputEl.files?.[0];
        if (!f || !data) return;

        const nameOk = /^[A-Za-z0-9._-]+$/.test(f.name);

        if (!nameOk) {
            alert('파일명에 영어만 사용 가능합니다다.');
            inputEl.value = '';
            return;
        }

        try {
            const { url } = await uploadImage(f); // 5MB 검증 내장
            const updated = await updateItem(data.id, { imageUrl: url });
            setData(updated);
        } catch (err: any) {
            alert(err.message);
        } finally {
            if (inputEl) inputEl.value = '';
            if (fileRef.current && fileRef.current !== inputEl) {
                fileRef.current.value = '';
            }
        }
    };


    const active = useMemo(
        () => !!data && (data.isCompleted || !!(data.memo ?? '').trim() || !!data.imageUrl),
        [data]
    );
    // 제목 저장 
    const saveTitle = async () => {
        if (!data) return;
        const name = draft.trim();
        if (!name || name === data.name) {
            setEditing(false);
            return;
        }
        try {
            const updated = await updateItem(data.id, { name });
            setData(updated);
        } catch (e: any) {
            alert(e.message);
        } finally {
            setEditing(false);
        }
    };

    const toggleChecked = async (next: boolean) => {
        if (!data) return;
        try {
            const updated = await updateItem(data.id, { isCompleted: next });
            setData(updated);
        } catch (e: any) {
            alert(e.message);
        }
    };

    const saveAll = async () => {
        if (!data) return;

        try {
            const patch: Partial<Item> = {};

            // 제목: 공백 제거 후 기존과 다를 때만 전송
            const trimmedName = draft.trim();
            if (trimmedName && trimmedName !== data.name) {
                patch.name = trimmedName;
            }

            // 메모: 공백 제거 후 비어있으면 보내지 않음
            const trimmedMemo = (data.memo ?? '').trim();
            if (trimmedMemo) {
                patch.memo = trimmedMemo;
            } else if (data.memo && !trimmedMemo) {
                // 기존에 메모가 있었는데 비웠다면 null로 (서버가 null 허용하는 경우)
                patch.memo = null;
            }

            // 이미지: 값이 있으면 전송 (이미지 제거하려면 null 전송)
            if (data.imageUrl) {
                patch.imageUrl = data.imageUrl;
            }

            // 완료 여부: 항상 반영
            patch.isCompleted = data.isCompleted;

            // 변경 사항이 없다면 그냥 목록으로 이동
            if (Object.keys(patch).length === 0) {
                router.replace('/');
                return;
            }

            await updateItem(data.id, patch);

            // ✅ 저장 성공 → 목록으로 이동
            router.replace('/');
        } catch (e: any) {
            alert(e.message);
        } finally {
            setSaving(false);
        }
    };


    const remove = async () => {
        if (!data) return;
        if (!confirm('정말 삭제할까요?')) return;
        try {
            await deleteItem(data.id);
            router.replace('/');
        } catch (e: any) {
            alert(e.message);
        }
    };

    if (loading || !data) return null;

    return (
        <main className={styles.page}>
            <div className={styles.inner}>
                {/* 타이틀 */}
                <div className={`${styles.titleRow} ${data.isCompleted ? styles.titleChecked : ''}`}>
                    <span className={styles.check}>
                        <ToggleCheck checked={data.isCompleted} onChange={toggleChecked} size={32} />
                    </span>

                    {!editing ? (
                        <button
                            type="button"
                            className={`${styles.titleLabel} text-16r`}
                            onClick={() => {
                                setDraft(data.name);
                                setEditing(true);
                            }}
                            aria-label="제목 편집"
                            title={`ID: ${data.id}`}
                        >
                            {data.name}
                        </button>
                    ) : (
                        <div className={styles.titleEdit}>
                            <input
                                className={`${styles.titleInput} text-16r`}
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveTitle();
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
                        <div className={`${styles.imageBox} ${data.imageUrl ? styles.hasImage : ''}`}>
                            {data.imageUrl ? (
                                <img
                                    src={data.imageUrl}
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
                                    aria-label={data.imageUrl ? '이미지 수정' : '이미지 추가'}
                                    onClick={pickImage}
                                >
                                    {data.imageUrl ? <Pen size={22} /> : <Plus size={22} />}
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
                            placeholder="메모를 입력하세요"
                            value={data.memo ?? ''}
                            onChange={(e) => setData((prev) => (prev ? { ...prev, memo: e.target.value } : prev))}
                            className="text-16r"
                        />
                    </div>
                </section>

                {/* 하단 */}
                <div className={styles.actions}>
                    <Button
                        variant={data.isCompleted ? 'revise' : 'normal'}
                        className="text-16b"
                        onClick={saveAll}
                    >
                        <Check size={16} /> 수정 완료
                    </Button>
                    <Button variant="delete" className="text-16b" onClick={remove}>
                        <X size={16} /> 삭제하기
                    </Button>
                </div>
            </div>
        </main>
    );
}