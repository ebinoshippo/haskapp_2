import { create } from 'zustand'
import type { Cache, CourseWithUserInfo, ScheduleIndex } from '../types/cache'
import type {
  Event,
  Task,
  Tag,
  Course,
  CourseSchedule,
} from '../types/app'

type AppStore = Cache & {
  setEvents: (events: Event[]) => void
  setTasks: (tasks: Task[]) => void
  setCourses: (courses: CourseWithUserInfo[]) => void
  setScheduleIndex: (scheduleIndex: ScheduleIndex) => void
  setTags: (tags: Tag[]) => void
  setCourseCatalog: (courses: Course[]) => void
  setCourseSchedules: (
  courseSchedules: CourseSchedule[]
  ) => void
}

export const useAppStore = create<AppStore>((set) => ({
  events: [],
  tasks: [],
  courses: [],
  scheduleIndex: {},
  tags: [],
  courseCatalog: [],
  courseSchedules: [],

  setEvents: (events) => {
    set({ events })
  },

  setTasks: (tasks) => {
    set({ tasks })
  },

  setCourses: (courses) => {
    set({ courses })
  },

  setScheduleIndex: (scheduleIndex) => {
    set({ scheduleIndex })
  },

  setTags: (tags) => {
    set({ tags })
  },

  setCourseCatalog: (courses) => {
    set({ courseCatalog: courses })
  },

  setCourseSchedules: (courseSchedules) => {
    set({ courseSchedules })
  },
}))