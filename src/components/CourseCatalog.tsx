import { useAppStore } from '../store/appStore'
import {
  cacheEnrollCourse,
} from '../cache/courseCache'
import { getCurrentUser } from '../lib/auth'

export default function CourseCatalog() {
  const courseCatalog = useAppStore(
    (state) => state.courseCatalog
  )
  const myCourses = useAppStore(
    (state) => state.courses
  )

  async function handleEnroll(courseId: string) {
    const user = await getCurrentUser()

    if (!user) {
      alert('ログインしてください')
      return
    }

    await cacheEnrollCourse(user.id, courseId)
  }

  return (
    <div>
      <h2>全コース一覧</h2>

      {courseCatalog.map((course) => {
        const isEnrolled = myCourses.some(
          (item) => item.course.id === course.id
        )

        return (
          <div key={course.id}>
            <h3>{course.name}</h3>
            <p>教室：{course.classroom ?? '未設定'}</p>
            <p>学部：{course.faculty ?? '未設定'}</p>

            {isEnrolled ? (
              <span>登録済み</span>
            ) : (
              <button
                onClick={() => handleEnroll(course.id)}
              >
                自分の授業に登録
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}