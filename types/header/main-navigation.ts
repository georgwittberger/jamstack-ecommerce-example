import { NuxtContentResult } from '@/types/nuxt-content-result'

type MainNavigation = {
  entries: MainNavigationEntry[]
}

type MainNavigationEntry = {
  name: string
  path: string
}

export type MainNavigationResult = MainNavigation & NuxtContentResult
