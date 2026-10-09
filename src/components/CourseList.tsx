import CourseForm from './CourseForm'
import { useAppStore } from '../store/appStore'
import { cacheDeleteUserCourse } from '../cache/courseCache'

export default function CourseList() {
  const courses = useAppStore((state) => state.courses)

  async function handleUnenroll(userCourseId: string) {
    const confirmed = window.confirm(
      'この授業の履修登録を解除しますか？'
    )

    if (!confirmed) return

    await cacheDeleteUserCourse(userCourseId)
  }

  return (
    <div>
      <h2>自分の授業</h2>

      {courses.map(({ course, userCourse }) => (
        <div key={course.id}>
          <h3>{course.name}</h3>

          <p>教室：{course.classroom ?? '未設定'}</p>
          <p>学部：{course.faculty ?? '未設定'}</p>

          <CourseForm
            course={{ course, userCourse }}
          />

        <button
          onClick={() => handleUnenroll(userCourse.id)}
        >
          履修登録を解除
        </button>
        </div>
      ))}
    </div>
  )
}