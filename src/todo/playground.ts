import {
  createTask,
  filterTasks,
  removeTask,
  toggleTask,
  type Filter,
  type Task,
} from './todo.ts'

const show = (label: string, tasks: Task[]) =>
  console.log(
    `${label}: ${tasks.map((t) => `${t.title}${t.completed ? '(done)' : ''}`).join(', ') || '(empty)'}`,
  )

let tasks: Task[] = [createTask('A'), createTask('B'), createTask('C')]

tasks = toggleTask(tasks, tasks[1].id)
tasks = toggleTask(tasks, tasks[2].id)

const filter: Filter = 'completed'
show('visible before', filterTasks(tasks, filter))

tasks = removeTask(tasks, filter, 1)

show('visible after ', filterTasks(tasks, filter))
show('all after     ', tasks)
