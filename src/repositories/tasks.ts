import { supabase } from '../lib/supabase'
import type { Task } from '../types/app'

export async function dbGetTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')

  if (error) {
    throw error
  }

  const { data: taskTags, error: taskTagsError } = await supabase
    .from('task_tags')
    .select('task_id, tag_id')

  if (taskTagsError) {
    throw taskTagsError
  }

  const tagIdsByTask = new Map<string, string[]>()

  for (const taskTag of taskTags) {
    const tagIds = tagIdsByTask.get(taskTag.task_id) ?? []

    tagIds.push(taskTag.tag_id)

    tagIdsByTask.set(taskTag.task_id, tagIds)
  }

  return data.map((task) => ({
    id: task.id,
    userId: task.user_id,
    title: task.title,
    description: task.description,
    dueAt: task.due_at,
    completed: task.completed,
    eventId: task.event_id,
    courseId: task.course_id,
    tagIds: tagIdsByTask.get(task.id) ?? [],
  }))
}

export async function dbCreateTask(
  title: string,
  description: string | null,
  dueAt: string | null,
  userId: string,
  courseId: string | null
): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title,
      description,
      due_at: dueAt,
      user_id: userId,
      course_id: courseId,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    description: data.description,
    dueAt: data.due_at,
    completed: data.completed,
    eventId: data.event_id,
    courseId: data.course_id,
    tagIds: [],
  }
}

export async function dbUpdateTask(
  taskId: string,
  title: string,
  description: string | null,
  dueAt: string | null,
  completed: boolean,
  eventId: string | null,
  courseId: string | null
) {
  const { error } = await supabase
    .from('tasks')
    .update({
      title,
      description,
      due_at: dueAt,
      completed,
      event_id: eventId,
      course_id: courseId,
    })
    .eq('id', taskId)

  if (error) {
    throw error
  }
}

export async function dbDeleteTask(taskId: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)

  if (error) {
    throw error
  }
}

export async function dbSetTaskTags(
  taskId: string,
  tagIds: string[]
) {
  // 既存のタグ関連付けを削除
  const { error: deleteError } = await supabase
    .from('task_tags')
    .delete()
    .eq('task_id', taskId)

  if (deleteError) {
    throw deleteError
  }

  // 新しいタグ関連付けを登録
  if (tagIds.length === 0) {
    return
  }

  const { error: insertError } = await supabase
    .from('task_tags')
    .insert(
      tagIds.map((tagId) => ({
        task_id: taskId,
        tag_id: tagId,
      }))
    )

  if (insertError) {
    throw insertError
  }
}