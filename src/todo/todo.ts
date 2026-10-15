export type Filter = 'all' | 'active' | 'completed'

export interface Task {
  id: number
  title: string
  completed: boolean
}

let nextId = 1

export function createTask(title: string): Task {
  return { id: nextId++, title, completed: false }
}

export function toggleTask(tasks: Task[], id: number): Task[] {
  return tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task,
  )
}

export function filterTasks(tasks: Task[], filter: Filter): Task[] {
  if (filter === 'active') return tasks.filter((task) => !task.completed)
  if (filter === 'completed') return tasks.filter((task) => task.completed)
  return tasks
}

export function removeTask(
  tasks: Task[],
  filter: Filter,
  visibleIndex: number,
): Task[] {
  if (visibleIndex < 0 || visibleIndex >= filterTasks(tasks, filter).length) {
    return tasks
  }
  return tasks.filter((_, index) => index !== visibleIndex)
}
