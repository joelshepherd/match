/** Match the value against the conditions and return the result. */
export function match<E extends Expression, W extends When<E, any, any>[]>(
  expression: E,
  whens: W
): ReturnType<W[0][1]> | undefined {
  for (const [compare, then] of whens) {
    if (compare(expression)) return then(expression);
  }
  // @todo remove `undefined` from response if `otherwise()` is used
}

/** Default case which matches any value. */
export function otherwise<E extends Expression, R>(
  then: Then<E, E, R>
): When<E, E, R> {
  return [() => true, then];
}

/** Add a new match case. */
export function when<E extends Expression, P extends Condition, R>(
  condition: P,
  then: Then<E, P, R>
): When<E, P, R> {
  return [createCompare(condition), then];
}

function createCompare(condition: Condition): Compare {
  // Match regex
  if (condition instanceof RegExp) {
    return (value) => condition.test(String(value));
  }
  // Match constructor
  if (isConstructor(condition)) {
    return (value) => condition === value.constructor;
  }
  if (typeof condition === "function") {
    return (value) => condition(value);
  }
  // Match object keys
  if (typeof condition === "object") {
    return (value) =>
      typeof value === "object" && compareObject(condition, value);
  }
  // Exact match
  return (value) => Object.is(condition, value);
}

function isConstructor(value: any): value is Constructor {
  return Boolean(value && value.prototype && value.prototype.constructor.name);
}

function compareObject(condition: object, value: object) {
  if (Object.is(condition, value)) return true;

  const keys = Object.getOwnPropertyNames(condition);

  for (const key of keys) {
    // @ts-ignore
    if (!createCompare(condition[key])(value[key])) {
      return false;
    }
  }

  return true;
}

type BuiltIn = (...args: any[]) => any;
type Constructor = new (...args: any[]) => any;
type Expression = boolean | number | object | string;
type Condition =
  | boolean
  | number
  | object
  | string
  | Compare
  | RegExp
  | BuiltIn
  | Constructor;
type ActionType<T> = T extends RegExp
  ? ReturnType<T["exec"]>
  : T extends BuiltIn
  ? ReturnType<T>
  : T extends Constructor
  ? InstanceType<T>
  : T extends object
  ? { [K in keyof T]: ActionType<T[K]> }
  : T;
type Then<E, T extends Condition, R> = (
  value: Intersection<E, ActionType<T>>
) => R;
type Compare = (value: Expression) => boolean;
export type When<E = any, O extends Condition = any, R = any> = [
  Compare,
  Then<E, O, R>
];

type Intersection<A, B> = A & B;

// function m<C, W extends any[]>(condition: C, ws: W):
