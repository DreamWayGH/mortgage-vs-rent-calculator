// 管理「比較結果列表」的 state hook（含 LocalStorage 持久化）
import { useCallback, useEffect, useRef, useState } from 'react';
import { calculateScenario } from '../utils/investment';

const STORAGE_KEY = 'mortgage-vs-rent:scenarios';

/**
 * 從 LocalStorage 還原 scenarios（只存 inputs，重新計算 result）
 */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { scenarios: [], nextId: 1 };
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved) || saved.length === 0) return { scenarios: [], nextId: 1 };
    const scenarios = saved.map((item) => ({
      id: item.id,
      inputs: item.inputs,
      result: calculateScenario(item.inputs),
      expanded: false,
    }));
    const maxId = Math.max(...scenarios.map((s) => s.id));
    return { scenarios, nextId: maxId + 1 };
  } catch {
    return { scenarios: [], nextId: 1 };
  }
}

/**
 * 存入 LocalStorage（只存 id + inputs，不存計算結果以節省空間）
 */
function saveToStorage(scenarios) {
  try {
    const data = scenarios.map((s) => ({ id: s.id, inputs: s.inputs }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable — 靜默失敗
  }
}

/**
 * scenario 結構：
 * {
 *   id: number,         // 序號（不會因刪除而重排）
 *   inputs: {...},      // 計算時的輸入快照
 *   result: { mortgage, investment },
 *   expanded: boolean,  // 是否展開明細
 * }
 */
export default function useScenarios() {
  const [scenarios, setScenarios] = useState(() => {
    const { scenarios: loaded } = loadFromStorage();
    return loaded;
  });
  const nextIdRef = useRef(() => {
    const { nextId } = loadFromStorage();
    return nextId;
  });

  // 初始化 nextIdRef（只執行一次）
  if (typeof nextIdRef.current === 'function') {
    nextIdRef.current = nextIdRef.current();
  }

  // 每次 scenarios 變動時同步到 LocalStorage
  useEffect(() => {
    saveToStorage(scenarios);
  }, [scenarios]);

  const addScenario = useCallback((inputs) => {
    const result = calculateScenario(inputs);
    const id = nextIdRef.current++;
    setScenarios((prev) => [
      ...prev,
      { id, inputs: { ...inputs }, result, expanded: false },
    ]);
  }, []);

  const removeScenario = useCallback((id) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setScenarios([]);
    nextIdRef.current = 1;
  }, []);

  const toggleExpand = useCallback((id) => {
    setScenarios((prev) =>
      prev.map((s) => (s.id === id ? { ...s, expanded: !s.expanded } : s))
    );
  }, []);

  return { scenarios, addScenario, removeScenario, clearAll, toggleExpand };
}
