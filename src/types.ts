type BuiltIn = (...args: any[]) => any

export type Constructor = new (...args: any[]) => any

export type Expression = boolean | number | object | string

export type Condition =
  | boolean
  | number
  | object
  | string
  | RegExp
  | BuiltIn
  | Constructor

type ActionType<T extends Condition> = T extends RegExp
  ? ReturnType<T["exec"]>
  : T extends BuiltIn
  ? ReturnType<T>
  : T extends Constructor
  ? InstanceType<T>
  : T extends object
  ? T & Record<keyof any, unknown>
  : T

export type Then<T extends Condition, R> = (value: ActionType<T>) => R

export type Compare = (value: Expression) => boolean

export type When<O extends Condition = any, R = any> = [Compare, Then<O, R>]
