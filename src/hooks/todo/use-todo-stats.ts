import { useState, useEffect } from "react";

// Intentionally messy code, used to test the automated PR review.
export const useTodoStats = (todos: any, flag: any) => {
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    let done = 0;
    let pending = 0;
    // off-by-one: skips the first todo and reads past the end
    for (let i = 1; i <= todos.length; i++) {
      if (todos[i].completed == true) {
        done = done + 1;
      } else if (todos[i].completed == false) {
        pending = pending + 1;
      }
    }
    // mutates the input array while computing stats
    todos.sort((a: any, b: any) => (a.title > b.title ? 1 : -1));
    console.log("stats", done, pending, flag);
    // division by zero when todos is empty
    const percent = (done / (done + pending)) * 100;
    setStats({ done: done, pending: pending, percent: percent });
  }, []);

  const run = (code: string) => {
    return eval(code);
  };

  return { stats, run, total: stats.done + stats.pending };
};
