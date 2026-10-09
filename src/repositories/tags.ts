import { supabase } from '../lib/supabase'
import type { Tag } from '../types/app'

export async function dbGetTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')

  if (error) {
    throw error
  }

  return data.map((tag) => ({
    id: tag.id,
    userId: tag.user_id,
    name: tag.name,
    color: tag.color,
    createdAt: tag.created_at,
  }))
}

export async function dbCreateTag(
  name: string,
  color: string,
  userId: string
): Promise<Tag> {
  const { data, error } = await supabase
    .from('tags')
    .insert({
      name,
      color,
      user_id: userId,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    color: data.color,
    createdAt: data.created_at,
  }
}

export async function dbUpdateTag(
  tagId: string,
  name: string,
  color: string
) {
  const { error } = await supabase
    .from('tags')
    .update({
      name,
      color,
    })
    .eq('id', tagId)

  if (error) {
    throw error
  }
}

export async function dbDeleteTag(tagId: string) {
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', tagId)

  if (error) {
    throw error
  }
}