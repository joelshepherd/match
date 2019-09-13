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
  // Match regex
  if (condition instanceof RegExp) {
    return value => condition.test(String(value))
  }
  // Match constructor
  if (isConstructor(condition)) {
    return value => condition === value.constructor
  }
  // Match object keys
  if (typeof condition === "object") {
    return value => typeof value === "object" && compareObject(condition, value)
  }
  // @todo Add function
  // Exact match
  return value => Object.is(condition, value)
}

function isConstructor(value: any): value is Constructor {
  return Boolean(value && value.prototype && value.prototype.constructor.name)
}

function compareObject(condition: object, value: object) {
  if (Object.is(condition, value)) return true

  const keys = Object.getOwnPropertyNames(condition)

  for (const key of keys) {
    // @ts-ignore
    if (!createCompare(condition[key])(value[key])) {
      return false
    }
  }

  return true
}
