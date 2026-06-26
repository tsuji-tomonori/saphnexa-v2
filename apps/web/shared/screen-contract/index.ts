export type AuthMode = 'public' | 'authenticated'

export type ScreenStateContract = {
  readonly id: string
  readonly summary: string
  readonly story?: string
  readonly visualTest?: boolean
}

export type ScreenActionContract = {
  readonly id: string
  readonly label: string
  readonly kind: 'navigate' | 'submit' | 'command'
  readonly toScreenId?: `SCR-${string}`
  readonly operationId?: string
  readonly requiredPermissions?: readonly string[]
}

export type ScreenApiDependencyContract = {
  readonly operationId: string
  readonly trigger: string
  readonly resultStates: readonly string[]
}

export type ScreenContract = {
  readonly id: `SCR-${string}`
  readonly title: string
  readonly summary: string
  readonly route: {
    readonly name: string
    readonly path: string
    readonly params?: Record<string, unknown>
    readonly query?: Record<string, unknown>
  }
  readonly access: {
    readonly mode: AuthMode
    readonly permissions: readonly string[]
  }
  readonly layout: string
  readonly apiDependencies: readonly ScreenApiDependencyContract[]
  readonly states: readonly ScreenStateContract[]
  readonly actions: readonly ScreenActionContract[]
}

export function defineScreenContract<const T extends ScreenContract>(contract: T): T {
  return contract
}
