import { useState } from 'react'
import { cacheCreateEvent, cacheSetEventTags } from '../cache/eventCache'
import { useAppStore } from '../store/appStore'

type EventFormProps = {
  userId: string
}

function EventForm({ userId }: EventFormProps) {
  const tags = useAppStore((state) => state.tags)
  const courses = useAppStore((state) => state.courses)

  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState('')

  async function handleCreateEvent() {
  const event = await cacheCreateEvent(
    title,
    description || null,
    startAt,
    endAt,
    userId,
    selectedCourseId || null
  )

  await cacheSetEventTags(event.id, selectedTagIds)

  setTitle('')
  setDescription('')
  setStartAt('')
  setEndAt('')
  setSelectedTagIds([])
  setSelectedCourseId('')
}

  return (
    <div>
      <h2>Create Event</h2>

      <div>
        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Start
          <input
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          End
          <input
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
          />
        </label>
      </div>
        <div>
        <label>
          講義
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
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
          <label key={tag.id}>
            <input
              type="checkbox"
              checked={selectedTagIds.includes(tag.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedTagIds((current) => [
                    ...current,
                    tag.id,
                  ])
                } else {
                  setSelectedTagIds((current) =>
                    current.filter((id) => id !== tag.id)
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
                marginRight: '6px',
              }}
            />

            {tag.name}
          </label>
        ))}
      </div>

      <button onClick={handleCreateEvent}>
        Create Event
      </button>
    </div>
  )
}

export default EventForm