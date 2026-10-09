import type { CourseSchedule } from '../types/app'
import type { ScheduleIndex } from '../types/cache'

export function createScheduleIndex(
  schedules: CourseSchedule[]
): ScheduleIndex {
  const index: ScheduleIndex = {}

  for (const schedule of schedules) {
    const { dayOfWeek, period, courseId } = schedule

    if (!index[dayOfWeek]) {
      index[dayOfWeek] = {}
    }

    if (!index[dayOfWeek][period]) {
      index[dayOfWeek][period] = []
    }

    index[dayOfWeek][period].push(courseId)
  }

  return index
}