# match

A fun experiment emulating (some of) the upcoming pattern matching proposal.

## Usage

Example usage returning a phrase based on a number.

```ts
import { match, otherwise, when } from "match-[something]"

const howMany = match(count, [
  when(0, () => "None for you"),
  when(1, () => "You have one"),
  when(2, () => "You have a couple"),
  when(Number, x => `You have ${x}`),
  otherwise(() => {
    throw new Error("Is this even a number?") // it's not
  }),
])

console.log(howMany)
```

Example usage the spirit of Rust's result convention.

```ts
import { match, when } from "match-[something]"

class Result {
  constructor(public value: number) {}
}

function findValue(x: number): Result | Error {
  return x > 0 ? new Result(x) : new Error("Invalid number")
}

const result: number = match(findValue(number), [
  when(Result, res => res.value),
  when(Error, () => 0),
])

console.log(result)
```
