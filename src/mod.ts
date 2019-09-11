import {
  Compare,
  Condition,
  Constructor,
  Expression,
  Then,
  When,
} from "./types"

/**
 * Match the value against the conditions and return the result.
 */
export function match(expression: Expression, whens: When[]) {
  for (const [compare, then] of whens) {
    if (compare(expression)) return then(expression)
  }
}

/**
 * Default case which matches any value.
 */
export function otherwise(then: Then<any, any>): When {
  return [() => true, then]
}

/**
 * Add a new match case.
 */
export function when<P extends Condition, R>(
  condition: P,
  then: Then<P, R>,
): When<P, R> {
  return [createCompare(condition), then]
}

function createCompare(condition: Condition): Compare {
  // Match constructor
  if (isConstructor(condition)) return value => condition === value.constructor
  // Exact match
  return value => Object.is(condition, value)
}

function isConstructor(value: any): value is Constructor {
  return Boolean(value && value.prototype && value.prototype.constructor.name)
}
