'use client';

import { useEffect, useRef, useState } from 'react';
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

// ✅ 에러 메시지 안전 추출 유틸
function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === 'string') return err;
    try {
        return JSON.stringify(err);
    } catch {
        return 'Unknown error';
    }
}


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

    //수정 파일
    const [editing, setEditing] = useState(false);

    //할 일 이름
    const [draft, setDraft] = useState('');

    // 초기 조회
    useEffect(() => {
        (async () => {
            try {
                const item = await getItem(Number(id));
                setData(item);
            } catch {
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
    }, [id, q]);

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

        const nameOk = /^[A-Za-z]+\.(?:jpe?g|png|gif|webp|svg|heic|heif|bmp|tiff?)$/i.test(f.name);

        if (!nameOk) {
            alert('파일은 영어로만 된 이름을 가진 이미지만 가능합니다.');
            inputEl.value = '';
            return;
        }

        try {
            const { url } = await uploadImage(f); // 5MB 검증 내장
            const updated = await updateItem(data.id, { imageUrl: url });
            setData(updated);
        } catch (err: unknown) {
            alert(getErrorMessage(err));
        } finally {
            if (inputEl) inputEl.value = '';
            if (fileRef.current && fileRef.current !== inputEl) {
                fileRef.current.value = '';
            }
        }
    };

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
        } catch (err: unknown) {
            alert(getErrorMessage(err));
        } finally {
            setEditing(false);
        }
    };

    const toggleChecked = async (next: boolean) => {
        if (!data) return;
        try {
            const updated = await updateItem(data.id, { isCompleted: next });
            setData(updated);
        } catch (err: unknown) {
            alert(getErrorMessage(err));
        }
    };

    const saveAll = async () => {
        if (!data || saving) return;

        try {
            setSaving(true);
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

            // 목록으로 이동
            router.replace('/');
        } catch (err: unknown) {
            alert(getErrorMessage(err));
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
        } catch (err: unknown) {
            alert(getErrorMessage(err));
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
                    )}
                </div>

                {/* 본문 */}
                <section className={styles.content}>
                    {/* 이미지 */}
                    <div className={styles.imagePanel}>
                        <div className={`${styles.imageBox} ${data.imageUrl ? styles.hasImage : ''}`}>
                            {data.imageUrl ? (
                                <div className={styles.imageClip}>
                                    <Image
                                        src={data.imageUrl}
                                        alt=""
                                        fill
                                        sizes="(max-width: 768px) 100vw, 588px"
                                        className={styles.coverImg}
                                        unoptimized
                                    />
                                </div>
                            ) : (
                                <div className={styles.placeholder}>
                                    <Image src="/icons/emptyImage.svg" alt="" width={64} height={64} />
                                </div>
                            )}

                            <div className={styles.addImageBtn}>
                                <Button
                                    shape="circle"
                                    size={64}
                                    className={data.imageUrl ? styles.penBtn : styles.plusBtn}
                                    aria-label={data.imageUrl ? '이미지 수정' : '이미지 추가'}
                                    onClick={pickImage}
                                >
                                    {data.imageUrl ? <Pen color="#fff" size={22} /> : <Plus size={22} />}
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
                            defaultValue={data.memo ?? ''}
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
                        disabled={saving}
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