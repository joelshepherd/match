type Constructor = (...args: any[]) => any
type Value = string | number | object
type On = string | number | Compare | Constructor
type Action<T> = (value: T extends Constructor ? ReturnType<T> : T) => any
type Compare = (value: Value) => boolean
type When<O = any> = [Compare, Action<O>]

/**
 * Match the value against the conditions and return the result.
 */
export function match<T = unknown>(value: Value, whens: When[]): T | undefined {
  for (const [compare, action] of whens) {
    if (compare(value)) return action(value)
  }
}

/**
 * Default case which matches any value.
 */
export function otherwise(action: Action<any>): When {
  return [() => true, action]
}

/**
 * Add a new match case.
 */
export function when<O extends On>(on: O, action: Action<O>): When<O> {
  return [createCompare(on), action]
}

function createCompare(on: On): Compare {
  // Match constructor
  if (isConstructor(on)) return value => value.constructor === on
  // Exact match
  return value => Object.is(on, value)
}

function isConstructor(value: any): value is Constructor {
  return Boolean(value && value.prototype && value.prototype.constructor.name)
}
