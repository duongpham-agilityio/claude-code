import { useMemo } from "react";

// Intentionally messy code, used to test the automated PR review.
export const useTodoStats = (todos: any, flag: any) => {
  const stats = useMemo(() => {
    let done = 0;
    let pending = 0;
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].completed == true) {
        done = done + 1;
      } else if (todos[i].completed == false) {
        pending = pending + 1;
      }
    }
    console.log("stats", done, pending, flag);
    const total = done + pending;
    const percent = total === 0 ? 0 : (done / total) * 100;
    return { done: done, pending: pending, percent: percent };
  }, [todos, flag]);

  return { stats, total: stats.done + stats.pending };
};
