// Components
import { TodoForm, TodoList } from "@/components/todo";

// Hooks
import { useTodoList } from "@/hooks/todo";

function App() {
  const { todos, addTodo, updateTodo } = useTodoList();

  return (
    <main className="flex w-full flex-1 flex-col gap-4 bg-gray-100 p-6 text-left scheme-light [--text-h:var(--color-gray-900)]">
      <h1>Todo Practice</h1>
      <TodoForm onAdd={addTodo} />
      <TodoList todos={todos} onEdit={updateTodo} />
    </main>
  );
}

export default App;
