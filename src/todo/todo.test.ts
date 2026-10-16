import { describe, expect, it } from 'vitest'
import {
  createTask,
  filterTasks,
  removeTask,
  toggleTask,
  type Task,
} from './todo.ts'

const titles = (tasks: Task[]) => tasks.map((task) => task.title)

const setup = (): Task[] => {
  let tasks = [createTask('A'), createTask('B'), createTask('C')]
  tasks = toggleTask(tasks, tasks[1].id)
  tasks = toggleTask(tasks, tasks[2].id)
  return tasks
}

describe('removeTask', () => {
  it('removes the clicked task when the completed filter is active (TODO-103)', () => {
    const tasks = removeTask(setup(), 'completed', 1)

    expect(titles(tasks)).toEqual(['A', 'B'])
    expect(titles(filterTasks(tasks, 'completed'))).toEqual(['B'])
  })

  it('removes the clicked task when the all filter is active', () => {
    const tasks = removeTask(setup(), 'all', 1)

    expect(titles(tasks)).toEqual(['A', 'C'])
  })
})
