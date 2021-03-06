# mch

A fun library emulating (some of) the upcoming [pattern matching proposal](https://github.com/tc39/proposal-pattern-matching).

No dependencies and native TypeScript support.

Supports a variety of match types:

| Type             | Examples                        | Match method                          |
| ---------------- | ------------------------------- | ------------------------------------- |
| Value            | `when(20, ...)`                 | Strictly equals the exact value       |
| Object           | `when({ status: Number }, ...)` | Recursively passes each key condition |
| Constructor      | `when(String, ...)`             | Instance of the constructor           |
| RegExp           | `when(/hi/, ...)`               | Tests positive against the RegExp     |
| Compare Function | `when(x => x === 10, ...)`      | Custom compare function               |
| Default          | `otherwise(...)`                | Default fallback that maches anything |

## Install

`npm install mch` or `yarn add mch`

## Usage

```ts
import { match, otherwise, when } from "mch"
```

Example usage returning a phrase based on a number.

```ts
const message = match(count, [
  when(0, () => "None for you"),
  when(1, () => "You have one"),
  when(Number, x => `You have ${x}`),
  otherwise(() => {
    throw new Error("Is this even a number?") // it's not
  }),
])
```

Example usage with React.

```tsx
<div>
  {match(value, [
    when(0, () => <span>You have none</span>),
    when(Number, x => <span>You have {x}</span>),
    when(Error, error => <ErrorRender error={error}>),
  ])}
</div>
```

Example usage with async/await and a fetch response.

```ts
const response = await fetch(url)

const body = await match(response, [
  when({ status: /2\d\d/ }, res => res.json()),
  when({ status: 404 }, () => {
    throw new Error("404 Not Found")
  }),
])
```

Example usage the spirit of Rust's result convention.

```ts
function findValue(x: number): Result<number, string> {
  return x > 0 ? new Ok(x) : new Err("Invalid number")
}

const result = match(findValue(number), [
  when(Ok, ({ value }) => value),
  when(Err, () => 0),
])
```
