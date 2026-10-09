import { supabase } from '../lib/supabase'
import type {
  Course,
  UserCourse,
  CourseSchedule,
} from '../types/app'

import type {
  CourseWithUserInfo
} from '../types/cache'

export async function dbGetCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')

  if (error) {
    throw error
  }

  return data.map((course) => ({
    id: course.id,
    name: course.name,
    classroom: course.classroom,
    description: course.description,
    gradingCriteria: course.grading_criteria,
    requiredAttendanceCount: course.required_attendance_count,
    reportPercentage: course.report_percentage,
    examPercentage: course.exam_percentage,
    quizPercentage: course.quiz_percentage,
    classCount: course.class_count,
    semester: course.semester,
    faculty: course.faculty,
    syllabusId: course.syllabus_id,
    createdAt: course.created_at,
    updatedAt: course.updated_at,
  }))
}

export async function dbCreateCourse(
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
): Promise<Course> {
  const { data, error } = await supabase
    .from('courses')
    .insert({
      name,
      classroom,
      description,
      grading_criteria: gradingCriteria,
      required_attendance_count: requiredAttendanceCount,
      report_percentage: reportPercentage,
      exam_percentage: examPercentage,
      quiz_percentage: quizPercentage,
      class_count: classCount,
      semester,
      faculty,
      syllabus_id: syllabusId,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return {
    id: data.id,
    name: data.name,
    classroom: data.classroom,
    description: data.description,
    gradingCriteria: data.grading_criteria,
    requiredAttendanceCount: data.required_attendance_count,
    reportPercentage: data.report_percentage,
    examPercentage: data.exam_percentage,
    quizPercentage: data.quiz_percentage,
    classCount: data.class_count,
    semester: data.semester,
    faculty: data.faculty,
    syllabusId: data.syllabus_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function dbUpdateCourse(
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
  const { error } = await supabase
    .from('courses')
    .update({
      name,
      classroom,
      description,
      grading_criteria: gradingCriteria,
      required_attendance_count: requiredAttendanceCount,
      report_percentage: reportPercentage,
      exam_percentage: examPercentage,
      quiz_percentage: quizPercentage,
      class_count: classCount,
      semester,
      faculty,
      syllabus_id: syllabusId,
    })
    .eq('id', courseId)

  if (error) {
    throw error
  }
}

export async function dbDeleteCourse(courseId: string) {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId)

  if (error) {
    throw error
  }
}

export async function dbGetUserCourses(): Promise<UserCourse[]> {
  const { data, error } = await supabase
    .from('user_courses')
    .select('*')

  if (error) {
    throw error
  }

  return data.map((userCourse) => ({
    id: userCourse.id,
    userId: userCourse.user_id,
    courseId: userCourse.course_id,
    absenceCount: userCourse.absence_count,
    lateCount: userCourse.late_count,
    personalMemo: userCourse.personal_memo,
    createdAt: userCourse.created_at,
    updatedAt: userCourse.updated_at,
  }))
}

export async function dbCreateUserCourse(
  userId: string,
  courseId: string,
  absenceCount: number,
  lateCount: number,
  personalMemo: string | null
): Promise<UserCourse> {
  const { data, error } = await supabase
    .from('user_courses')
    .insert({
      user_id: userId,
      course_id: courseId,
      absence_count: absenceCount,
      late_count: lateCount,
      personal_memo: personalMemo,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return {
    id: data.id,
    userId: data.user_id,
    courseId: data.course_id,
    absenceCount: data.absence_count,
    lateCount: data.late_count,
    personalMemo: data.personal_memo,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function dbUpdateUserCourse(
  userCourseId: string,
  absenceCount: number,
  lateCount: number,
  personalMemo: string | null
) {
  const { error } = await supabase
    .from('user_courses')
    .update({
      absence_count: absenceCount,
      late_count: lateCount,
      personal_memo: personalMemo,
    })
    .eq('id', userCourseId)

  if (error) {
    throw error
  }
}

export async function dbDeleteUserCourse(
  userCourseId: string
) {
  const { error } = await supabase
    .from('user_courses')
    .delete()
    .eq('id', userCourseId)

  if (error) {
    throw error
  }
}

export async function dbGetCoursesWithUserInfo(): Promise<CourseWithUserInfo[]> {
  const courses = await dbGetCourses()
  const userCourses = await dbGetUserCourses()

  return courses
    .map((course) => {
      const userCourse = userCourses.find(
        (userCourse) => userCourse.courseId === course.id
      )

      if (!userCourse) {
        return null
      }

      return {
        course,
        userCourse,
      }
    })
    .filter(
      (course): course is CourseWithUserInfo =>
        course !== null
    )
}

export async function dbGetCourseSchedules(): Promise<CourseSchedule[]> {
  const { data, error } = await supabase
    .from('course_schedules')
    .select('*')

  if (error) {
    throw error
  }

  return data.map((schedule) => ({
    id: schedule.id,
    courseId: schedule.course_id,
    dayOfWeek: schedule.day_of_week,
    period: schedule.period,
    createdAt: schedule.created_at,
  }))
}

export async function dbGetCourseSchedulesByCourseIds(
  courseIds: string[]
): Promise<CourseSchedule[]> {
  if (courseIds.length === 0) {
    return []
  }
  const { data, error } = await supabase
    .from('course_schedules')
    .select('*')
    .in('course_id', courseIds)

  if (error) throw error

  return data.map((schedule) => ({
    id: schedule.id,
    courseId: schedule.course_id,
    dayOfWeek: schedule.day_of_week,
    period: schedule.period,
    createdAt: schedule.created_at,
  }))
}


export async function dbCreateCourseSchedule(
  courseId: string,
  dayOfWeek: number,
  period: number
): Promise<CourseSchedule> {
  const { data, error } = await supabase
    .from('course_schedules')
    .insert({
      course_id: courseId,
      day_of_week: dayOfWeek,
      period,
    })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    courseId: data.course_id,
    dayOfWeek: data.day_of_week,
    period: data.period,
    createdAt: data.created_at,
  }
}

export async function dbUpdateCourseSchedule(
  scheduleId: string,
  dayOfWeek: number,
  period: number
) {
  const { error } = await supabase
    .from('course_schedules')
    .update({
      day_of_week: dayOfWeek,
      period,
    })
    .eq('id', scheduleId)

  if (error) throw error
}

export async function dbDeleteCourseSchedule(
  scheduleId: string
) {
  const { error } = await supabase
    .from('course_schedules')
    .delete()
    .eq('id', scheduleId)

  if (error) throw error
}