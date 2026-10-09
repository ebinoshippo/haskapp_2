import { useEffect, useState } from 'react'
import {
  getCurrentUser,
  signInWithGoogle,
} from './lib/auth'
import { initCache } from './cache/initCache'
import { useAppStore } from './store/appStore'
import EventForm from './components/EventForm'
import EventList from './components/EventList'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TagForm from './components/TagForm'
import TagList from './components/TagList'
import CourseList from './components/CourseList'
import CourseCatalog from './components/CourseCatalog'
import CourseAdmin from './components/CourseAdmin'

function App() {
  const [userId, setUserId] = useState<string | null>(null)

  const events = useAppStore((state) => state.events)
  const tasks = useAppStore((state) => state.tasks)
  const tags = useAppStore((state) => state.tags)

  useEffect(() => {
    async function loadUser() {
      const user = await getCurrentUser()

      setUserId(user?.id ?? null)
    }

    loadUser()
  }, [])

  useEffect(() => {
    if (userId) {
      initCache()
    }
  }, [userId])

  return (
    <div>
      <h1>Calendar App</h1>

      {userId ? (
        <>
          <p>ログイン中: {userId}</p>

          <EventForm userId={userId} />

          <EventList events={events} />

          <TaskForm userId={userId} />

          <TaskList tasks={tasks} />

          <TagForm userId={userId} />

          <TagList tags={tags} />

          <CourseList />

          <CourseCatalog />

          <CourseAdmin />
        </>
      ) : (
        <button onClick={signInWithGoogle}>
          Googleでログイン
        </button>
      )}
    </div>
  )
}

export default App