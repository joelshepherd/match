type BuiltIn = (...args: any[]) => any

export type Constructor = new (...args: any[]) => any

export type Expression = string | number | object

export type Condition = string | number | BuiltIn | Constructor

type ActionType<T> = T extends BuiltIn
  ? ReturnType<T>
  : T extends Constructor
  ? InstanceType<T>
  : T

export type Then<T, R> = (value: ActionType<T>) => R

export type Compare = (value: Expression) => boolean

export type When<O = any, R = any> = [Compare, Then<O, R>]
