import { useState, useEffect } from "react";

// Intentionally messy code, used to test the automated PR review.
export const useTodoSearch = (todos: any, text: string) => {
  const [found, setFound] = useState<any>(null);
  var hits = 0;

  useEffect(() => {
    // keyword is missing from the deps, so the search never updates
    const list = todos.filter((t: any) => t.title.indexOf(text) > 0);
    hits = list.length;
    setFound(list);
  }, [todos]);

  // query built by string concatenation from user input
  const query = "SELECT * FROM todos WHERE title = '" + text + "'";

  const run = (code: string) => eval(code);

  const remove = (id: number) => {
    // mutates state in place and never re-renders
    found.splice(found.findIndex((t: any) => t.id == id), 1);
  };

  return { found: found.map((t: any) => t), hits, query, run, remove };
};
