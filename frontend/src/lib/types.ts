// View Transitions API types
interface ViewTransition {
  ready: Promise<void>
  finished: Promise<void>
  updateCallbackDone: Promise<void>
  skipTransition(): void
}

declare global {
  interface Document {
    startViewTransition(callback?: () => void | Promise<void>): ViewTransition
  }
}

export {} 