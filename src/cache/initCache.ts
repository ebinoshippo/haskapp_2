import { cacheRefreshEvents } from './eventCache'
import { cacheRefreshTasks } from './taskCache'
import { cacheRefreshCourseCatalog, cacheRefreshCourses } from './courseCache'
import { cacheRefreshTags } from './tagCache'

export async function initCache() {
  await Promise.all([
    cacheRefreshEvents(),
    cacheRefreshTasks(),
    cacheRefreshCourses(),
    cacheRefreshTags(),
    cacheRefreshCourseCatalog()
  ])
}