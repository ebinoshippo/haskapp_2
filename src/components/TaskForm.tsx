import { useState } from 'react'
import {
  cacheCreateTask,
  cacheSetTaskTags,
} from '../cache/taskCache'
import { useAppStore } from '../store/appStore'

type TaskFormProps = {
  userId: string
}

function TaskForm({ userId }: TaskFormProps) {
  const tags = useAppStore((state) => state.tags)
  const courses = useAppStore((state) => state.courses)

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueAt, setDueAt] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState('')

  async function handleCreateTask() {
    const task = await cacheCreateTask(
      title,
      description || null,
      dueAt || null,
      userId,
      selectedCourseId || null
    )
    await cacheSetTaskTags(task.id, selectedTagIds)

    setTitle('')
    setDescription('')
    setDueAt('')
    setSelectedTagIds([])
    setSelectedCourseId('')
  }

  return (
    <div>
      <h2>Create Task</h2>

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
          Due
          <input
            type="datetime-local"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
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
              <option
                key={course.course.id}
                value={course.course.id}
              >
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
      <button onClick={handleCreateTask}>
        Create Task
      </button>
    </div>
  )
}

export default TaskForm