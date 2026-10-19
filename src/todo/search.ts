import type { Task } from './todo'

export const searchTasks = (tasks: Task[], query: string): Task[] => {
  const keyword = query.trim().toLowerCase()
  if (keyword === '') return tasks
  return tasks.filter((task) => task.title.toLowerCase().includes(keyword))
}
