'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import styles from '@/styles/Homepage.module.css';

import AddToDoInput from '@/app/_components/AddToDoInput';
import Button from '@/app/_components/Button';
import CheckList, { CheckItem } from '@/app/_components/CheckList';
import Plus from '@/icons/Plus';

export default function HomePage() {
  const router = useRouter();

  const [items, setItems] = useState<CheckItem[]>([
    { id: '1', label: '비타민 챙겨 먹기', checked: false },
    { id: '2', label: '맥주 마시기', checked: false },
    { id: '3', label: '운동하기', checked: false },
    { id: '4', label: '은행 다녀오기', checked: true },
    { id: '5', label: '비타민 챙겨 먹기', checked: true },
  ]);
  const [text, setText] = useState('');

  const todo = useMemo(() => items.filter(i => !i.checked), [items]);
  const done = useMemo(() => items.filter(i => i.checked), [items]);

  const toggle = (id: string, next: boolean) =>
    setItems(prev => prev.map(i => (i.id === id ? { ...i, checked: next } : i)));

  const add = () => {
    const label = text.trim();
    if (!label) return;
    setItems(prev => [{ id: crypto.randomUUID(), label, checked: false }, ...prev]);
    setText('');
  };

  /** 라벨 클릭 → 상세로 이동 (id는 경로, label/checked는 쿼리로 전달) */
  const openDetail = (item: CheckItem) => {
    const q = new URLSearchParams({
      label: item.label,
      checked: item.checked ? '1' : '0',
    });
    router.push(`/detail/${item.id}?${q.toString()}`);
  };

  return (
    <main className={styles.page}>
      {/* 헤더 */}
      <header className={styles.header}>
        <div className={styles.inputRow}>
          <AddToDoInput
            full
            placeholder="할 일을 입력해주세요"
            value={text}
            onChange={e => setText(e.target.value)}
          />

          {/* 데스크탑/태블릿: 큰 버튼 */}
          <div className={styles.addBtnLgWrap}>
            <Button variant="normal" className="text-16b" onClick={add}>
              <Plus size={16} /> 추가하기
            </Button>
          </div>

          {/* 모바일: miniPill 아이콘 버튼만 노출 */}
          <div className={styles.addBtnSm}>
            <Button
              variant="normal"
              shape="miniPill"
              aria-label="할 일 추가"
              onClick={add}
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>
      </header>

      {/* 보드 */}
      <section className={styles.board}>
        {/* TO DO */}
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

        {/* DONE */}
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

/** 비어있을 때 안내 */
function Empty({ type }: { type: 'todo' | 'done' }) {
  const img = type === 'todo' ? '/images/emptyToDo.svg' : '/images/emptyDone.svg';
  const caption =
    type === 'todo'
      ? '할 일이 없어요.\nTODO를 새롭게 추가해주세요!'
      : '아직 완료된 일이 없어요.\n해야 할 일을 체크해 주세요!';

  return (
    <div className={styles.empty}>
      <Image src={img} alt="" width={180} height={120} />
      <p className="text-14r" style={{ whiteSpace: 'pre-line' }}>{caption}</p>
    </div>
  );
}
