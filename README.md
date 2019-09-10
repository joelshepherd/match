# match

A fun experiment emulating the upcoming pattern matching proposal.

## Usage

```ts
import { match, otherwise, when } from "match-[something]"

let howMany = match(count, [
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
