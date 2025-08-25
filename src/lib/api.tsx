// Item 타입 정의
export type Item = {
  id: number;
  tenantId: string;
  name: string;
  memo?: string | null;
  imageUrl?: string | null;
  isCompleted: boolean;
};

// API base URL과 tenant ID
const BASE = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/+$/, '');
const TENANT = process.env.NEXT_PUBLIC_TENANT_ID ?? '';
if (!TENANT) throw new Error('Missing NEXT_PUBLIC_TENANT_ID');

// BASE + path 로 요청
// FormData일 경우 Content-Type 자동 처리
// 에러 발생 시 상세 로그 출력
async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(init?.headers || {}),
    },
  });

  // 응답 실패 시 에러 로그
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('[API ERROR]', {
      url,
      method: init?.method ?? 'GET',
      status: res.status,
      statusText: res.statusText,
      response: text,
    });
    throw new Error(`API ${res.status} ${res.statusText} — ${text || 'no body'}`);
  }

  // 204 응답 시 undefined 반환
  if (res.status === 204) return undefined as unknown as T;

  //JSON 파싱 후 반환
  return (await res.json()) as T;
}

// 빈 문자열("")은 서버로 보내지 않음
// 메모 삭제: null 전달
// 이미지 제거: null 전달
function sanitizePatch(patch: Partial<Item>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  // 제목
  if (patch.name !== undefined) {
    if (typeof patch.name === 'string') {
      const t = patch.name.trim();
      if (t) payload.name = t;
    } else {
      payload.name = patch.name;
    }
  }

  // 메모 처리
  if (patch.memo !== undefined) {
    if (patch.memo === null) {
      // 없을 시 삭제
      payload.memo = null;
    } else if (typeof patch.memo === 'string') {
      const t = patch.memo.trim();
      // 공백 아닌 값만 전송
      if (t) payload.memo = t;
    }
  }

  // 이미지 처리
  if (patch.imageUrl !== undefined) {
    if (typeof patch.imageUrl === 'string') {
      const t = patch.imageUrl.trim();
      if (t) payload.imageUrl = t;
      else payload.imageUrl = null;
    } else {
      payload.imageUrl = patch.imageUrl;
    }
  }

  // 완료 여부 처리
  if (patch.isCompleted !== undefined) {
    payload.isCompleted = patch.isCompleted;
  }

  return payload;
}

// 조회
export const listItems = (p?: { page?: number; pageSize?: number }) => {
  const qs = new URLSearchParams();
  if (p?.page && p.page > 0) qs.set('page', String(p.page));
  if (p?.pageSize && p.pageSize > 0) qs.set('pageSize', String(p.pageSize));
  const q = qs.toString() ? `?${qs.toString()}` : '';
  return req<Item[]>(`/api/${encodeURIComponent(TENANT)}/items${q}`);
};

// 추가
export const createItem = (body: { name: string }) =>
  req<Item>(`/api/${encodeURIComponent(TENANT)}/items`, {
    method: 'POST',
    body: JSON.stringify({ name: body.name.trim() }),
  });

// 조회
export const getItem = (id: number) =>
  req<Item>(`/api/${encodeURIComponent(TENANT)}/items/${id}`);

// 수정
export const updateItem = (id: number, patch: Partial<Item>) =>
  req<Item>(`/api/${encodeURIComponent(TENANT)}/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(sanitizePatch(patch)),
  });

// 삭제
export const deleteItem = (id: number) =>
  req<{ message: string }>(`/api/${encodeURIComponent(TENANT)}/items/${id}`, {
    method: 'DELETE',
  });

// 이미지 업로드
export const uploadImage = (file: File) => {
  if (file.size > 5 * 1024 * 1024) throw new Error('이미지는 5MB 이하만 업로드할 수 있습니다.');
  const form = new FormData();
  form.set('image', file);
  return req<{ url: string }>(`/api/${encodeURIComponent(TENANT)}/images/upload`, {
    method: 'POST',
    body: form,
  });
};

// 완료 토글
export const toggleComplete = (item: Item) =>
  updateItem(item.id, { isCompleted: !item.isCompleted });