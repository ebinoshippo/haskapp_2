import { useState } from 'react'
import { useAppStore } from '../store/appStore'
import type { Task } from '../types/app'
import {
  cacheDeleteTask,
  cacheUpdateTask,
  cacheSetTaskTags,
} from '../cache/taskCache'
import { createEventFromTask } from '../utils/taskToEvent'

type TaskListProps = {
  tasks: Task[]
}

function TaskList({ tasks }: TaskListProps) {
  const tags = useAppStore((state) => state.tags)
  const courses = useAppStore((state) => state.courses)

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editDueAt, setEditDueAt] = useState('')
  const [editCompleted, setEditCompleted] = useState(false)
  const [editTagIds, setEditTagIds] = useState<string[]>([])
  const [editCourseId, setEditCourseId] = useState('')

  const [creatingEventTaskId, setCreatingEventTaskId] =
  useState<string | null>(null)

  const [eventStartAt, setEventStartAt] = useState('')
  const [eventEndAt, setEventEndAt] = useState('')

  async function handleDeleteTask(taskId: string) {
    await cacheDeleteTask(taskId)
  }

  async function handleEditTask(eventId: string | null) {
    if (!editingTaskId) {
      return
    }

    await cacheUpdateTask(
      editingTaskId,
      editTitle,
      editDescription || null,
      editDueAt || null,
      editCompleted,
      eventId,
      editCourseId || null
    )
    await cacheSetTaskTags(editingTaskId, editTagIds)

    setEditingTaskId(null)
  }


  async function handleCreateEvent(task: Task) {
    await createEventFromTask(
      task,
      eventStartAt,
      eventEndAt
    )

    setCreatingEventTaskId(null)
    setEventStartAt('')
    setEventEndAt('')
  }

  return (
    <div>
      <h2>Tasks</h2>

      {tasks.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>

          <div>
            {task.tagIds.map((tagId) => {

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

          <p>{task.description}</p>

          <p>
            期限: {task.dueAt}
          </p>

          <p>
            完了: {task.completed ? 'Yes' : 'No'}
          </p>

          <button
            onClick={() => {
              setEditingTaskId(task.id)
              setEditTitle(task.title)
              setEditDescription(task.description ?? '')
              setEditDueAt(task.dueAt ?? '')
              setEditCompleted(task.completed)
              setEditTagIds(task.tagIds)
              setEditCourseId(task.courseId ?? '')
            }}
          >
            Edit
          </button>

          <button onClick={() => {
            setCreatingEventTaskId(task.id)
            setEventStartAt('')
            setEventEndAt('')
          }}>
            予定にする
          </button>
          
          <button onClick={() => handleDeleteTask(task.id)}>
            Delete
          </button>



          {editingTaskId === task.id && (
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
                    onChange={(e) =>
                      setEditDescription(e.target.value)
                    }
                  />
                </label>
              </div>

              <div>
                <label>
                  Due
                  <input
                    type="datetime-local"
                    value={editDueAt}
                    onChange={(e) => setEditDueAt(e.target.value)}
                  />
                </label>
              </div>

              <div>
                <label>
                  Completed
                  <input
                    type="checkbox"
                    checked={editCompleted}
                    onChange={(e) =>
                      setEditCompleted(e.target.checked)
                    }
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

              <button onClick={() => handleEditTask(task.eventId)}>
                Save
              </button>
            </div>
          )}
          {creatingEventTaskId === task.id && (
            <div>
              <div>
                <label>
                  開始
                  <input
                    type="datetime-local"
                    value={eventStartAt}
                    onChange={(e) => setEventStartAt(e.target.value)}
                  />
                </label>
              </div>

              <div>
                <label>
                  終了
                  <input
                    type="datetime-local"
                    value={eventEndAt}
                    onChange={(e) => setEventEndAt(e.target.value)}
                  />
                </label>
              </div>
            
              <button onClick={() => handleCreateEvent(task)}>
                作成
              </button>
            </div>
            )}
        </div>
      ))}
    </div>
  )
}

export default TaskList