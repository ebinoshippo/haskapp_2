import {
  dbGetTasks,
  dbCreateTask,
  dbUpdateTask,
  dbDeleteTask,
  dbSetTaskTags,
} from '../repositories/tasks'
import { useAppStore } from '../store/appStore'
import type { Task } from '../types/app'

export function setTasks(newTasks: Task[]) {
  useAppStore.getState().setTasks(newTasks)
}

export function cacheGetTasks(): Task[] {
  return useAppStore.getState().tasks
}

export async function cacheRefreshTasks() {
  const newTasks = await dbGetTasks()

  setTasks(newTasks)
}

export async function cacheCreateTask(
  title: string,
  description: string | null,
  dueAt: string | null,
  userId: string,
  courseId: string | null
) {
  const task = await dbCreateTask(
    title,
    description,
    dueAt,
    userId,
    courseId
  )

  await cacheRefreshTasks()

  return task
}

export async function cacheUpdateTask(
  taskId: string,
  title: string,
  description: string | null,
  dueAt: string | null,
  completed: boolean,
  eventId: string | null,
  courseId: string | null
) {
  await dbUpdateTask(
    taskId,
    title,
    description,
    dueAt,
    completed,
    eventId,
    courseId
  )

  await cacheRefreshTasks()
}

export async function cacheDeleteTask(taskId: string) {
  await dbDeleteTask(taskId)

  await cacheRefreshTasks()
}

export async function cacheSetTaskTags(
  taskId: string,
  tagIds: string[]
) {
  await dbSetTaskTags(taskId, tagIds)
  await cacheRefreshTasks()
}