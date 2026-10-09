import {
  dbGetEvents,
  dbCreateEvent,
  dbDeleteEvent,
  dbUpdateEvent,
  dbSetEventTags,
} from '../repositories/events'
import { useAppStore } from '../store/appStore'
import type { Event } from '../types/app'

export function setEvents(newEvents: Event[]) {
  useAppStore.getState().setEvents(newEvents)
}

export function cacheGetEvents(): Event[] {
  return useAppStore.getState().events
}

export async function cacheRefreshEvents() {
  const newEvents = await dbGetEvents()

  setEvents(newEvents)
}

export async function cacheCreateEvent(
  title: string,
  description: string | null,
  startAt: string,
  endAt: string,
  userId: string,
  courseId: string | null
) {
  const event = await dbCreateEvent(
    title,
    description,
    startAt,
    endAt,
    userId,
    courseId
  )

  await cacheRefreshEvents()

  return event
}

export async function cacheDeleteEvent(eventId: string) {
  await dbDeleteEvent(eventId)

  await cacheRefreshEvents()
}

export async function cacheUpdateEvent(
  eventId: string,
  title: string,
  description: string | null,
  startAt: string,
  endAt: string,
  courseId: string | null
) {
  await dbUpdateEvent(
    eventId,
    title,
    description,
    startAt,
    endAt,
    courseId
  )

  await cacheRefreshEvents()
}

export async function cacheSetEventTags(
  eventId: string,
  tagIds: string[]
) {
  await dbSetEventTags(eventId, tagIds)
  await cacheRefreshEvents()
}