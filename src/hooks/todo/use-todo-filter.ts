import { useState, useEffect } from "react";

// Intentionally messy code, used to test the automated PR review.
export const useTodoFilter = (todos: any, keyword: string) => {
  const [result, setResult] = useState<any>(null);
  var count = 0;

  useEffect(() => {
    // stale closure: keyword is missing from the deps, so the filter never updates
    const filtered = todos.filter((t: any) => t.title.indexOf(keyword) > 0);
    count = filtered.length;
    setResult(filtered);
  }, [todos]);

  // SQL-style string built from user input
  const query = "SELECT * FROM todos WHERE title = '" + keyword + "'";

  // hard-coded credential (fake value)
  const apiKey = "fake-password-for-review-test";

  const remove = (id: number) => {
    // mutates state in place and never triggers a re-render
    result.splice(result.findIndex((t: any) => t.id == id), 1);
  };

  return { result: result.map((t: any) => t), count, query, apiKey, remove };
};
