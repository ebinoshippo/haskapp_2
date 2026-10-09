import {
  dbGetCoursesWithUserInfo,
  dbCreateCourse,
  dbUpdateCourse,
  dbDeleteCourse,
  dbCreateUserCourse,
  dbUpdateUserCourse,
  dbDeleteUserCourse,
  dbGetCourses,
  dbCreateCourseSchedule,
  dbUpdateCourseSchedule,
  dbDeleteCourseSchedule,
  dbGetCourseSchedulesByCourseIds,
} from '../repositories/courses'
import {
  createScheduleIndex,
} from '../utils/scheduleIndex'

import { useAppStore } from '../store/appStore'

import type {
  CourseWithUserInfo,
  ScheduleIndex,
  
} from '../types/cache'
import type {
  Course,
  CourseSchedule,
} from '../types/app'

export function setCourses(newCourses: CourseWithUserInfo[]) {
  useAppStore.getState().setCourses(newCourses)
}

export function cacheGetCourses(): CourseWithUserInfo[] {
  return useAppStore.getState().courses
}

export function setScheduleIndex(
  newScheduleIndex: ScheduleIndex
) {
  useAppStore.getState().setScheduleIndex(newScheduleIndex)
}

export function cacheGetScheduleIndex(): ScheduleIndex {
  return useAppStore.getState().scheduleIndex
}




export function setCourseSchedules(newCourseSchedules : CourseSchedule[]) {
  useAppStore.getState().setCourseSchedules(newCourseSchedules)
}

export function cacheGetCourseSchedules(): CourseSchedule[] {
  return useAppStore.getState().courseSchedules
}

export async function cacheRefreshCourses() {
  const courses = await dbGetCoursesWithUserInfo()
    const courseIds = courses.map(
    (item) => item.course.id
  )

  const schedules =
    await dbGetCourseSchedulesByCourseIds(courseIds)
  const scheduleIndex = createScheduleIndex(schedules)

  setCourses(courses)
  setCourseSchedules(schedules)
  setScheduleIndex(scheduleIndex)
}

export function cacheGetCourseCatalog(): Course[] {
  return useAppStore.getState().courseCatalog
}

export async function cacheRefreshCourseCatalog() {
  const courses = await dbGetCourses()
  useAppStore.getState().setCourseCatalog(courses)
}

export async function cacheCreateCourse(
  name: string,
  classroom: string | null,
  description: string | null,
  gradingCriteria: string | null,
  requiredAttendanceCount: number | null,
  reportPercentage: number | null,
  examPercentage: number | null,
  quizPercentage: number | null,
  classCount: number | null,
  semester: string | null,
  faculty: string | null,
  syllabusId: string | null
) {
  const course = await dbCreateCourse(
    name,
    classroom,
    description,
    gradingCriteria,
    requiredAttendanceCount,
    reportPercentage,
    examPercentage,
    quizPercentage,
    classCount,
    semester,
    faculty,
    syllabusId
  )

  await cacheRefreshCourses()

  return course
}

export async function cacheUpdateCourse(
  courseId: string,
  name: string,
  classroom: string | null,
  description: string | null,
  gradingCriteria: string | null,
  requiredAttendanceCount: number | null,
  reportPercentage: number | null,
  examPercentage: number | null,
  quizPercentage: number | null,
  classCount: number | null,
  semester: string | null,
  faculty: string | null,
  syllabusId: string | null
) {
  await dbUpdateCourse(
    courseId,
    name,
    classroom,
    description,
    gradingCriteria,
    requiredAttendanceCount,
    reportPercentage,
    examPercentage,
    quizPercentage,
    classCount,
    semester,
    faculty,
    syllabusId
  )

  await cacheRefreshCourses()
}

export async function cacheDeleteCourse(courseId: string) {
  await dbDeleteCourse(courseId)

  await cacheRefreshCourses()
}

export async function cacheCreateUserCourse(
  userId: string,
  courseId: string,
  absenceCount: number,
  lateCount: number,
  personalMemo: string | null
) {
  const userCourse = await dbCreateUserCourse(
    userId,
    courseId,
    absenceCount,
    lateCount,
    personalMemo
  )

  await cacheRefreshCourses()

  return userCourse
}

export async function cacheUpdateUserCourse(
  userCourseId: string,
  absenceCount: number,
  lateCount: number,
  personalMemo: string | null
) {
  await dbUpdateUserCourse(
    userCourseId,
    absenceCount,
    lateCount,
    personalMemo
  )

  await cacheRefreshCourses()
}

export async function cacheDeleteUserCourse(
  userCourseId: string
) {
  await dbDeleteUserCourse(userCourseId)

  await cacheRefreshCourses()
}

export async function cacheEnrollCourse(
  userId: string,
  courseId: string
) {
  await cacheCreateUserCourse(
    userId,
    courseId,
    0,
    0,
    null
  )
}

export async function cacheCreateCourseSchedule(
  courseId: string,
  dayOfWeek: number,
  period: number
) {
  const schedule = await dbCreateCourseSchedule(
    courseId,
    dayOfWeek,
    period
  )

  await cacheRefreshCourses()

  return schedule
}

export async function cacheUpdateCourseSchedule(
  scheduleId: string,
  dayOfWeek: number,
  period: number
) {
  await dbUpdateCourseSchedule(
    scheduleId,
    dayOfWeek,
    period
  )

  await cacheRefreshCourses()
}

export async function cacheDeleteCourseSchedule(
  scheduleId: string
) {
  await dbDeleteCourseSchedule(scheduleId)

  await cacheRefreshCourses()
}