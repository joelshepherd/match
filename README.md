# match

A fun experiment emulating the upcoming pattern matching proposal.

## Usage

```ts
import { any, match, number } from "match-[something]"

let howMany = match(count, {
  0: () => "None for you",
  1: () => "You have one",
  2: () => "You have a couple",
  [number]: x => `You have ${x}`,
  [any]: () => {
    throw new Error("What is this amount?")
  },
})

console.log(howMany)
```
