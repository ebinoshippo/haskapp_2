
import { useState } from 'react'
import { useAppStore } from '../store/appStore'
import {
  cacheCreateCourse,
  cacheUpdateCourse,
  cacheDeleteCourse,
  cacheRefreshCourseCatalog,
  cacheCreateCourseSchedule,
  cacheDeleteCourseSchedule,
  cacheUpdateCourseSchedule,
} from '../cache/courseCache'
import type { Course } from '../types/app'

export default function CourseAdmin() {
  const courseCatalog = useAppStore(
    (state) => state.courseCatalog
  )

    const courseSchedules = useAppStore(
    (state) => state.courseSchedules
    )

    

  const [editingCourse, setEditingCourse] =
    useState<Course | null>(null)

  const [name, setName] = useState('')
  const [classroom, setClassroom] = useState('')
  const [description, setDescription] = useState('')
  const [faculty, setFaculty] = useState('')
  const [semester, setSemester] = useState('')
  const [message, setMessage] = useState('')
  const [newDayOfWeek, setNewDayOfWeek] = useState(1)
  const [newPeriod, setNewPeriod] = useState(1)

  function startEdit(course: Course) {
    setEditingCourse(course)
    setName(course.name)
    setClassroom(course.classroom ?? '')
    setDescription(course.description ?? '')
    setFaculty(course.faculty ?? '')
    setSemester(course.semester ?? '')
    setMessage('')
  }

  function resetForm() {
    setEditingCourse(null)
    setName('')
    setClassroom('')
    setDescription('')
    setFaculty('')
    setSemester('')
  }

  async function handleSubmit() {
    if (!name.trim()) {
      setMessage('授業名を入力してください')
      return
    }

    try {
      if (editingCourse) {
        await cacheUpdateCourse(
          editingCourse.id,
          name.trim(),
          classroom.trim() || null,
          description.trim() || null,
          editingCourse.gradingCriteria,
          editingCourse.requiredAttendanceCount,
          editingCourse.reportPercentage,
          editingCourse.examPercentage,
          editingCourse.quizPercentage,
          editingCourse.classCount,
          semester.trim() || null,
          faculty.trim() || null,
          editingCourse.syllabusId
        )

        setMessage('コースを更新しました')
      } else {
        await cacheCreateCourse(
          name.trim(),
          classroom.trim() || null,
          description.trim() || null,
          null,
          null,
          null,
          null,
          null,
          null,
          semester.trim() || null,
          faculty.trim() || null,
          null
        )

        setMessage('コースを登録しました')
      }

      await cacheRefreshCourseCatalog()
      resetForm()
    } catch (error) {
      console.error(error)
      setMessage(
        '保存に失敗しました。運営権限やRLSを確認してください'
      )
    }
  }

  async function handleDelete(course: Course) {
    const confirmed = window.confirm(
        `「${course.name}」を削除しますか？\n履修登録しているユーザーの情報も削除されます。`
    )

    if (!confirmed) return

    try {
        await cacheDeleteCourse(course.id)
        await cacheRefreshCourseCatalog()

        if (editingCourse?.id === course.id) {
        resetForm()
        }

        setMessage('コースを削除しました')
    } catch (error) {
        console.error(error)
        setMessage(
        '削除に失敗しました。運営権限やRLSを確認してください'
        )
    }
  }

  return (
    <section>
      <h2>運営向けコース管理</h2>

      <h3>
        {editingCourse ? 'コースを編集' : '新しいコースを登録'}
      </h3>

      <label>
        授業名
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <br />

      <label>
        教室
        <input
          value={classroom}
          onChange={(e) => setClassroom(e.target.value)}
        />
      </label>

      <br />

      <label>
        説明
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <br />

      <label>
        学部
        <input
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
        />
      </label>

      <br />

      <label>
        学期
        <input
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        />
      </label>

      <br />

      <button onClick={handleSubmit}>
        {editingCourse ? '変更を保存' : 'コースを登録'}
      </button>

      {editingCourse && (
        <button onClick={resetForm}>
          編集をキャンセル
        </button>
      )}

      {message && <p>{message}</p>}

      <h3>登録済みコース</h3>

      {courseCatalog.map((course) => {

        const schedules = courseSchedules.filter(
        (schedule) => schedule.courseId === course.id
        )
        return (
        <div key={course.id}>
          <strong>{course.name}</strong>
          <p>教室：{course.classroom ?? '未設定'}</p>
          <p>学部：{course.faculty ?? '未設定'}</p>

          <button onClick={() => startEdit(course)}>
            編集
          </button>
          <button onClick={() => handleDelete(course)}>
            削除
          </button>
          <div>
            <h4>授業スケジュール</h4>

            {schedules.map((schedule) => (
            <div key={schedule.id}>
                <select
                value={schedule.dayOfWeek}
                onChange={async (e) => {
                    await cacheUpdateCourseSchedule(
                    schedule.id,
                    Number(e.target.value),
                    schedule.period
                    )
                }}
                >
                {['日', '月', '火', '水', '木', '金', '土'].map(
                    (day, index) => (
                    <option key={index} value={index}>
                        {day}曜日
                    </option>
                    )
                )}
                </select>

                <select
                value={schedule.period}
                onChange={async (e) => {
                    await cacheUpdateCourseSchedule(
                    schedule.id,
                    schedule.dayOfWeek,
                    Number(e.target.value)
                    )
                }}
                >
                {[1, 2, 3, 4, 5, 6].map((period) => (
                    <option key={period} value={period}>
                    {period}限
                    </option>
                ))}
                </select>

                <button
                onClick={async () => {
                    if (!window.confirm('このスケジュールを削除しますか？')) {
                    return
                    }

                    await cacheDeleteCourseSchedule(schedule.id)
                }}
                >
                削除
                </button>
            </div>
            ))}

            <select
                value={newDayOfWeek}
                onChange={(e) => setNewDayOfWeek(Number(e.target.value))}
            >
                <option value={0}>日曜日</option>
                <option value={1}>月曜日</option>
                <option value={2}>火曜日</option>
                <option value={3}>水曜日</option>
                <option value={4}>木曜日</option>
                <option value={5}>金曜日</option>
                <option value={6}>土曜日</option>
            </select>

            <select
                value={newPeriod}
                onChange={(e) => setNewPeriod(Number(e.target.value))}
            >
                {[1, 2, 3, 4, 5, 6].map((period) => (
                <option key={period} value={period}>
                    {period}限
                </option>
                ))}
            </select>

            <button
                onClick={async () => {
                await cacheCreateCourseSchedule(
                    course.id,
                    newDayOfWeek,
                    newPeriod
                )
                }}
            >
                スケジュール追加
            </button>
            </div>
        </div>
      )
      })}
    </section>
  )
}
