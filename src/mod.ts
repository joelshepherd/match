type Constructor = (...args: any[]) => any
type Value = string | number
type On = string | number | Constructor
type Matched<T> = T extends Constructor ? ReturnType<T> : T
type Action<T> = (value: Matched<T>) => any
type Compare = (value: Value) => boolean
type When<O = any> = [Compare, Action<O>]

export function match(value: Value, whens: When[]) {
  for (const [compare, action] of whens) {
    if (compare(value)) return action(value)
  }
}

export function when<O extends On>(on: O, action: Action<O>): When<O> {
  return [value => on === value, action]
}

// Test examples

const result = match("value", [
  when(42, x => "The answer to life, the universe, and everything."),
  when(String, x => `Hello {x}!`),
  when(Number, x => `You got: ${x}`),
  when(Error, x => `Oh no! ${x.message}`),
])

match("best", [
  when("good", () => "no"),
  when("better", () => "no"),
  when("best", () => "yes"),
])
