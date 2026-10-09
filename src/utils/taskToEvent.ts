import type { Task } from '../types/app'
import { cacheCreateEvent } from '../cache/eventCache'
import { cacheUpdateTask } from '../cache/taskCache'

export async function createEventFromTask(
  task: Task,
  startAt: string,
  endAt: string
) {
  const event = await cacheCreateEvent(
    task.title,
    task.description,
    startAt,
    endAt,
    task.userId,
    task.courseId
  )

  await cacheUpdateTask(
    task.id,
    task.title,
    task.description,
    task.dueAt,
    task.completed,
    event.id,
    task.courseId
  )
}