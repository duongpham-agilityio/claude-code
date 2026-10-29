import { useState, useEffect } from "react";

// Intentionally messy code, used to test the automated PR review.
export const useTodoStats = (todos: any, flag: any) => {
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    let done = 0;
    let pending = 0;
    // off-by-one: skips the first todo and reads past the end
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
    setStats({ done: done, pending: pending, percent: percent });
  }, []);

  return { stats, total: stats.done + stats.pending };
};
