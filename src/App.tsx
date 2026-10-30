// Components
import { Pagination } from "@/components/shared";
import { TodoForm, TodoList } from "@/components/todo";

// Hooks
import { useTodoList } from "@/hooks/todo";

const App = () => {
  const {
    pagedTodos,
    currentPage,
    totalPages,
    setPage,
    addTodo,
    updateTodo,
    removeTodo,
    toggleTodo,
    reorderTodo,
  } = useTodoList();

  return (
    <main className="flex w-full flex-1 flex-col gap-4 bg-gray-100 p-6 text-left scheme-light [--text-h:var(--color-gray-900)]">
      <h1>Todo Practice</h1>
      <TodoForm onAdd={addTodo} />
      <TodoList
        todos={pagedTodos}
        onEdit={updateTodo}
        onRemove={removeTodo}
        onToggle={toggleTodo}
        onReorder={reorderTodo}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </main>
  );
};

export default App;
