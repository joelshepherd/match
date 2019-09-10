type Constructor = (...args: any[]) => any
type Value = string | number | object
type On = string | number | Compare | Constructor
type Matched<T> = T extends Constructor ? ReturnType<T> : T
type Action<T> = (value: Matched<T>) => any
type Compare = (value: Value) => boolean
type When<O = any> = [Compare, Action<O>]

export function match<T = unknown>(value: Value, whens: When[]): T | undefined {
  for (const [compare, action] of whens) {
    if (compare(value)) return action(value)
  }
}

export function when<O extends On>(on: O, action: Action<O>): When<O> {
  return [buildCompare(on), action]
}

export function otherwise(action: Action<any>): When {
  return [() => true, action]
}

function buildCompare(on: On): Compare {
  // Match constructor
  if (isConstructor(on)) return value => value.constructor === on
  // Exact match
  return value => on === value
}

function isConstructor(value: any): value is Constructor {
  return Boolean(value.prototype) && Boolean(value.prototype.constructor.name)
}
