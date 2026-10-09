import { supabase } from '../lib/supabase'
import type { Event } from '../types/app'

export async function dbGetEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')

  if (error) {
    throw error
  }

  const { data: eventTags, error: eventTagsError } = await supabase
    .from('event_tags')
    .select('event_id, tag_id')

  if (eventTagsError) {
    throw eventTagsError
  }

  const tagIdsByEvent = new Map<string, string[]>()

  for (const eventTag of eventTags) {
    const tagIds = tagIdsByEvent.get(eventTag.event_id) ?? []

    tagIds.push(eventTag.tag_id)

    tagIdsByEvent.set(eventTag.event_id, tagIds)
  }

  return data.map((event) => ({
    id: event.id,
    userId: event.user_id,
    title: event.title,
    description: event.description,
    startAt: event.start_at,
    endAt: event.end_at,
    courseId: event.course_id,
    tagIds: tagIdsByEvent.get(event.id) ?? [],
  }))
}

export async function dbCreateEvent(
  title: string,
  description: string | null,
  startAt: string,
  endAt: string,
  userId: string,
  courseId: string | null
): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .insert({
      title,
      description,
      start_at: startAt,
      end_at: endAt,
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
    startAt: data.start_at,
    endAt: data.end_at,
    courseId: data.course_id,
    tagIds: [],
  }
}

export async function dbDeleteEvent(eventId: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)

  if (error) {
    throw error
  }
}

export async function dbUpdateEvent(
  eventId: string,
  title: string,
  description: string | null,
  startAt: string,
  endAt: string,
  courseId: string | null
) {
  const { error } = await supabase
    .from('events')
    .update({
      title,
      description,
      start_at: startAt,
      end_at: endAt,
      course_id: courseId,
    })
    .eq('id', eventId)

  if (error) {
    throw error
  }
}


export async function dbSetEventTags(
  eventId: string,
  tagIds: string[]
) {
  // 既存のタグ関連付けを削除
  const { error: deleteError } = await supabase
    .from('event_tags')
    .delete()
    .eq('event_id', eventId)

  if (deleteError) {
    throw deleteError
  }

  // 新しいタグ関連付けを登録
  if (tagIds.length === 0) {
    return
  }

  const { error: insertError } = await supabase
    .from('event_tags')
    .insert(
      tagIds.map((tagId) => ({
        event_id: eventId,
        tag_id: tagId,
      }))
    )

  if (insertError) {
    throw insertError
  }
}