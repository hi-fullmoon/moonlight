import { useReducer, useRef } from 'react';

// 强制组件重新渲染
export function useUpdate() {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  return forceUpdate;
}
