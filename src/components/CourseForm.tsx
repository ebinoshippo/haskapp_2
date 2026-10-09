import { useState } from 'react'
import type { CourseWithUserInfo } from '../types/cache'
import { cacheUpdateUserCourse } from '../cache/courseCache'

type Props = {
  course: CourseWithUserInfo
}

export default function CourseForm({ course }: Props) {
  const { userCourse } = course

  const [absenceCount, setAbsenceCount] = useState(
    userCourse.absenceCount
  )
  const [lateCount, setLateCount] = useState(
    userCourse.lateCount
  )
  const [personalMemo, setPersonalMemo] = useState(
    userCourse.personalMemo ?? ''
  )

  async function handleSave() {
    await cacheUpdateUserCourse(
      userCourse.id,
      absenceCount,
      lateCount,
      personalMemo || null
    )
  }

  return (
    <div>
      <h3>{course.course.name}の自分用情報</h3>

      <label>
        欠席数：
        <input
          type="number"
          min="0"
          value={absenceCount}
          onChange={(e) =>
            setAbsenceCount(Number(e.target.value))
          }
        />
      </label>

      <br />

      <label>
        遅刻数：
        <input
          type="number"
          min="0"
          value={lateCount}
          onChange={(e) =>
            setLateCount(Number(e.target.value))
          }
        />
      </label>

      <br />

      <label>
        メモ：
        <textarea
          value={personalMemo}
          onChange={(e) =>
            setPersonalMemo(e.target.value)
          }
        />
      </label>

      <br />

      <button onClick={handleSave}>
        保存
      </button>
    </div>
  )
}