import type { Database } from './database'

type DbEvent = Database['public']['Tables']['events']['Row']
type DbTask = Database['public']['Tables']['tasks']['Row']
type DbCourse = Database['public']['Tables']['courses']['Row']
type DbCourseSchedule =
  Database['public']['Tables']['course_schedules']['Row']
type DbUserCourse =
  Database['public']['Tables']['user_courses']['Row']
type DbTag = Database['public']['Tables']['tags']['Row']

export type Event = {
  id: DbEvent['id']
  userId: DbEvent['user_id']
  title: DbEvent['title']
  description: DbEvent['description']
  startAt: DbEvent['start_at']
  endAt: DbEvent['end_at']
  courseId: DbEvent['course_id']
  tagIds: string[]
}

export type Task = {
  id: DbTask['id']
  userId: DbTask['user_id']
  title: DbTask['title']
  description: DbTask['description']
  dueAt: DbTask['due_at']
  completed: DbTask['completed']
  eventId: DbTask['event_id']
  courseId: DbTask['course_id']
  tagIds: string[]
}

export type Course = {
  id: DbCourse['id']
  name: DbCourse['name']
  classroom: DbCourse['classroom']
  description: DbCourse['description']
  gradingCriteria: DbCourse['grading_criteria']
  requiredAttendanceCount: DbCourse['required_attendance_count']
  reportPercentage: DbCourse['report_percentage']
  examPercentage: DbCourse['exam_percentage']
  quizPercentage: DbCourse['quiz_percentage']
  classCount: DbCourse['class_count']
  semester: DbCourse['semester']
  faculty: DbCourse['faculty']
  syllabusId: DbCourse['syllabus_id']
  createdAt: DbCourse['created_at']
  updatedAt: DbCourse['updated_at']
}

export type CourseSchedule = {
  id: DbCourseSchedule['id']
  courseId: DbCourseSchedule['course_id']
  dayOfWeek: DbCourseSchedule['day_of_week']
  period: DbCourseSchedule['period']
  createdAt: DbCourseSchedule['created_at']
}

export type UserCourse = {
  id: DbUserCourse['id']
  userId: DbUserCourse['user_id']
  courseId: DbUserCourse['course_id']
  absenceCount: DbUserCourse['absence_count']
  lateCount: DbUserCourse['late_count']
  personalMemo: DbUserCourse['personal_memo']
  createdAt: DbUserCourse['created_at']
  updatedAt: DbUserCourse['updated_at']
}

export type Tag = {
  id: DbTag['id']
  userId: DbTag['user_id']
  name: DbTag['name']
  color: DbTag['color']
  createdAt: DbTag['created_at']
}