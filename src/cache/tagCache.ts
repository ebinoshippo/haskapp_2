import {
  dbGetTags,
  dbCreateTag,
  dbUpdateTag,
  dbDeleteTag,
} from '../repositories/tags'
import { useAppStore } from '../store/appStore'
import type { Tag } from '../types/app'

export function setTags(newTags: Tag[]) {
  useAppStore.getState().setTags(newTags)
}

export function cacheGetTags(): Tag[] {
  return useAppStore.getState().tags
}

export async function cacheRefreshTags() {
  const newTags = await dbGetTags()

  setTags(newTags)
}

export async function cacheCreateTag(
  name: string,
  color: string,
  userId: string
): Promise<Tag> {
  const tag = await dbCreateTag(
    name,
    color,
    userId
  )

  await cacheRefreshTags()

  return tag
}

export async function cacheUpdateTag(
  tagId: string,
  name: string,
  color: string
) {
  await dbUpdateTag(
    tagId,
    name,
    color
  )

  await cacheRefreshTags()
}

export async function cacheDeleteTag(tagId: string) {
  await dbDeleteTag(tagId)

  await cacheRefreshTags()
}