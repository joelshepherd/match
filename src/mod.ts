export const any = Symbol("any")
export const boolean = Symbol("boolean")
export const number = Symbol("number")
export const string = Symbol("string")

const typeMap = {
  boolean,
  number,
  string,
  bigint: undefined,
  object: undefined,
  function: undefined,
  symbol: undefined,
  undefined: undefined,
}

type TypeSymbol = typeof any | typeof number | typeof string

type Index = number | string | TypeSymbol

export function match<
  R,
  V extends number | string,
  C extends Partial<Record<Index, (value: V) => any>>
>(value: V, when: C): R | undefined {
  const fn = when[value] || when[typeMap[typeof value] as any] || when[any]
  if (fn) return fn(value)
}
