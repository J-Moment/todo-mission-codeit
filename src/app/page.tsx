'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from '@/styles/Homepage.module.css';

import AddToDoInput from '@/app/_components/AddToDoInput';
import Button from '@/app/_components/Button';
import CheckList, { CheckItem } from '@/app/_components/CheckList';
import Plus from '@/icons/Plus';

import { listItems, createItem, updateItem, type Item } from '@/lib/api';

// Item → CheckItem 변환
function toCheckItem(i: Item): CheckItem {
  return { id: String(i.id), label: i.name, checked: i.isCompleted };
}

// 에러 메시지 안전 추출 유틸
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err);
  } catch {
    return 'Unknown error';
  }
}

export default function HomePage() {
  const router = useRouter();

  // 전체 아이템
  const [items, setItems] = useState<Item[]>([]);
  // 입력창 상태
  const [text, setText] = useState('');

  // 할 일 로드
  useEffect(() => {
    listItems({ page: 1, pageSize: 100 })
      .then(setItems)
      .catch((e) => alert(e.message));
  }, []);

  // 항목 분리
  const todo = useMemo(() => items.filter((i) => !i.isCompleted).map(toCheckItem), [items]);
  const done = useMemo(() => items.filter((i) => i.isCompleted).map(toCheckItem), [items]);

  const add = async () => {
    const name = text.trim();
    if (!name) return;
    try {
      const created = await createItem({ name });
      setItems((prev) => [created, ...prev]);
      setText('');
    } catch (err: unknown) {
      alert(getErrorMessage(err));
    }
  };
  // 엔터키 활용 가능 핸들러
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    if (e.nativeEvent.isComposing) return;
    e.preventDefault();
    add();
  };

const toggle = async (id: string, next: boolean) => {
  const item = items.find((i) => String(i.id) === id);
  if (!item) return;
  try {
    const updated = await updateItem(item.id, { isCompleted: next });
    setItems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  } catch (err: unknown) {
    alert(err instanceof Error ? err.message : String(err));
  }
};

  // 라벨을 누르면 상세로 이동
  const openDetail = (ci: CheckItem) => router.push(`/detail/${ci.id}?label=${encodeURIComponent(ci.label)}&checked=${ci.checked ? '1' : '0'}`);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.inputRow}>
          <AddToDoInput
            full
            placeholder="할 일을 입력해주세요"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleEnter}
          />

          {/* 데스크탑/태블릿 버튼 */}
          <div className={styles.addBtnLgWrap}>
            <Button variant="normal" className="text-16b" onClick={add}>
              <Plus size={16} /> 추가하기
            </Button>
          </div>

          {/* 모바일: miniPill 만 보이게 해 둔 상태 */}
          <div className={styles.addBtnSm}>
            <Button variant="normal" shape="miniPill" aria-label="할 일 추가" onClick={add}>
              <Plus size={16} />
            </Button>
          </div>
        </div>
      </header>

      <section className={styles.board}>
        <div className={styles.col}>
          <div className={styles.sectionHead}>
            <Image src="/icons/todo.svg" alt="TO DO" width={101} height={36} priority />
          </div>
          {todo.length ? (
            <CheckList items={todo} onToggle={toggle} onLabelClick={openDetail} />
          ) : (
            <Empty type="todo" />
          )}
        </div>

        <div className={styles.col}>
          <div className={styles.sectionHead}>
            <Image src="/icons/done.svg" alt="DONE" width={101} height={36} priority />
          </div>
          {done.length ? (
            <CheckList items={done} onToggle={toggle} onLabelClick={openDetail} />
          ) : (
            <Empty type="done" />
          )}
        </div>
      </section>
    </main>
  );
}

function Empty({ type }: { type: 'todo' | 'done' }) {
  const img = type === 'todo' ? '/images/emptyToDo.svg' : '/images/emptyDone.svg';
  const caption =
    type === 'todo' ? '할 일이 없어요.\nTODO를 새롭게 추가해주세요!' : '아직 완료된 일이 없어요.\n해야 할 일을 체크해 주세요!';
  return (
    <div className={styles.empty}>
      <Image src={img} alt="" width={180} height={120} />
      <p className="text-14r" style={{ whiteSpace: 'pre-line' }}>{caption}</p>
    </div>
  );
}