import type {
  Event,
  Task,
  Course,
  CourseSchedule,
  UserCourse,
  Tag,
} from './app'

export type CourseWithUserInfo = {
  course: Course
  userCourse: UserCourse
}

export type ScheduleIndex = Record<
  number,
  Record<number, string[]>
>

export type Cache = {
  events: Event[]
  tasks: Task[]
  courses: CourseWithUserInfo[]
  courseCatalog: Course[]
  scheduleIndex: ScheduleIndex
  tags: Tag[]
  courseSchedules: CourseSchedule[]
}