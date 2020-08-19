import { NuxtContentResult } from '@/types/nuxt-content-result'

export interface MainNavigationResult
  extends MainNavigation,
    NuxtContentResult {}

interface MainNavigation {
  entries: MainNavigationEntry[]
}

interface MainNavigationEntry {
  name: string
  path: string
}
