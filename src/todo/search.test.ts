import { describe, expect, it } from 'vitest'
import { searchTasks } from './search'
import { filterTasks, type Task } from './todo'

const tasks: Task[] = [
  { id: 1, title: 'Buy milk', completed: false },
  { id: 2, title: 'Call mom', completed: true },
]

describe('searchTasks', () => {
  it('matches a substring of the title', () => {
    expect(searchTasks(tasks, 'mil')).toEqual([tasks[0]])
  })

  it('is case-insensitive', () => {
    expect(searchTasks(tasks, 'MILK')).toEqual([tasks[0]])
    expect(searchTasks(tasks, 'call')).toEqual([tasks[1]])
  })

  it('returns all tasks for an empty query', () => {
    expect(searchTasks(tasks, '')).toEqual(tasks)
  })

  it('returns all tasks for a blank query', () => {
    expect(searchTasks(tasks, '   ')).toEqual(tasks)
  })

  it('returns an empty array when nothing matches', () => {
    expect(searchTasks(tasks, 'xyz')).toEqual([])
  })

  it('works together with the status filter', () => {
    expect(searchTasks(filterTasks(tasks, 'completed'), 'mil')).toEqual([])
    expect(searchTasks(filterTasks(tasks, 'completed'), 'mom')).toEqual([
      tasks[1],
    ])
  })
})
