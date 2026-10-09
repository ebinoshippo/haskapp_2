import { useState } from 'react'
import { useAppStore } from '../store/appStore'
import type { Event } from '../types/app'
import {
  cacheDeleteEvent,
  cacheUpdateEvent,
  cacheSetEventTags,
} from '../cache/eventCache'

type EventListProps = {
  events: Event[]
}

function EventList({ events }: EventListProps) {
  const tags = useAppStore((state) => state.tags)
  const courses = useAppStore((state) => state.courses)
  
  const [editingEventId, setEditingEventId] = useState<string | null>(null)

  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editStartAt, setEditStartAt] = useState('')
  const [editEndAt, setEditEndAt] = useState('')
  const [editTagIds, setEditTagIds] = useState<string[]>([])
  const [editCourseId, setEditCourseId] = useState('')

  async function handleDeleteEvent(eventId: string) {
    await cacheDeleteEvent(eventId)
  }

  async function handleEditEvent() {
    if (!editingEventId) {
        return
    }

    await cacheUpdateEvent(
      editingEventId,
      editTitle,
      editDescription || null,
      editStartAt,
      editEndAt,
      editCourseId || null
    )
    await cacheSetEventTags(editingEventId, editTagIds)
    setEditingEventId(null)
    }

  return (
    <div>
      <h2>Events</h2>

      {events.map((event) => (
        <div key={event.id}>
          <h3>{event.title}</h3>

          <div>
            {event.tagIds.map((tagId) => {
              const tag = tags.find((item) => item.id === tagId)

              if (!tag) {
                return null
              }

              return (
                <span
                  key={tag.id}
                  style={{
                    display: 'inline-block',
                    backgroundColor: tag.color,
                    color: '#ffffff',
                    padding: '2px 8px',
                    marginRight: '6px',
                    marginBottom: '4px',
                    borderRadius: '12px',
                  }}
                >
                  {tag.name}
                </span>
              )
            })}
          </div>

          <p>{event.description}</p>
          <p>
            {event.startAt} ～ {event.endAt}
          </p>
          <button
            onClick={() => {
              setEditingEventId(event.id)
              setEditTitle(event.title)
              setEditDescription(event.description ?? '')
              setEditStartAt(event.startAt)
              setEditEndAt(event.endAt)
              setEditTagIds(event.tagIds)
              setEditCourseId(event.courseId ?? '')
            }}
          >
            Edit
          </button>

          <button onClick={() => handleDeleteEvent(event.id)}>
            Delete
          </button>
          
          {editingEventId === event.id && (
            <div>
                <div>
                <label>
                    Title
                    <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    />
                </label>
                </div>

                <div>
                <label>
                    Description
                    <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    />
                </label>
                </div>

                <div>
                <label>
                    Start
                    <input
                    type="datetime-local"
                    value={editStartAt}
                    onChange={(e) => setEditStartAt(e.target.value)}
                    />
                </label>
                </div>

                <div>
                <label>
                    End
                    <input
                    type="datetime-local"
                    value={editEndAt}
                    onChange={(e) => setEditEndAt(e.target.value)}
                    />
                </label>
                </div>

                <div>
                  <label>
                    講義
                    <select
                      value={editCourseId}
                      onChange={(e) => setEditCourseId(e.target.value)}
                    >
                      <option value="">講義なし</option>

                      {courses.map((course) => (
                        <option key={course.course.id} value={course.course.id}>
                          {course.course.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div>
                  <p>Tags</p>

                  {tags.map((tag) => (
                    <label
                      key={tag.id}
                      style={{
                        display: 'block',
                        marginBottom: '4px',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={editTagIds.includes(tag.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditTagIds((prev) => [...prev, tag.id])
                          } else {
                            setEditTagIds((prev) =>
                              prev.filter((id) => id !== tag.id)
                            )
                          }
                        }}
                      />

                      <span
                        style={{
                          display: 'inline-block',
                          width: '12px',
                          height: '12px',
                          backgroundColor: tag.color,
                          margin: '0 6px',
                          borderRadius: '3px',
                        }}
                      />

                      {tag.name}
                    </label>
                  ))}
                </div>
                <button onClick={handleEditEvent}>
                    Save
                </button>
            </div>
            )}
        </div>
      ))}
    </div>
  )
}

export default EventList