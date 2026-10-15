import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  createTask,
  filterTasks,
  removeTask,
  toggleTask,
  type Task,
} from '../src/todo/todo.ts'

const titles = (tasks: Task[]) => tasks.map((task) => task.title)

function setup(): Task[] {
  let tasks = [createTask('A'), createTask('B'), createTask('C')]
  tasks = toggleTask(tasks, tasks[1].id)
  tasks = toggleTask(tasks, tasks[2].id)
  return tasks
}

describe('removeTask', () => {
  it('removes the clicked task when the completed filter is active (TODO-103)', () => {
    const tasks = removeTask(setup(), 'completed', 1)

    assert.deepEqual(titles(tasks), ['A', 'B'])
    assert.deepEqual(titles(filterTasks(tasks, 'completed')), ['B'])
  })

  it('removes the clicked task when the all filter is active', () => {
    const tasks = removeTask(setup(), 'all', 1)

    assert.deepEqual(titles(tasks), ['A', 'C'])
  })
})
