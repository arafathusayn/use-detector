# The `useDetector` hook for React

`useDetector` hook is designed to observe changes in a variable and trigger re-renders automatically when the variable changes.

### Install 

```bash
# npm:
npm install use-detector
# bun:
bun add use-detector
# jsr:
npx jsr add @tsx/use-detector
```

### Simple Example

```jsx
import { useValue } from "use-detector"

let count = 0

function Count() {
  useValue(() => count)

  return <p>{count}</p>
}

function DoubleCount() {
  useValue(() => count)

  return <p>{count * 2}</p>
}

export default function App() {
  return (
    <div>
      <Count />
      <DoubleCount />
      <button onClick={() => count++}>Increment</button>
      <button onClick={() => count--}>Decrement</button>
    </div>
  )
}
```

### Full Example Usage

```jsx
import { useDetector } from "use-detector"

let count = 0

function Count() {
  useDetector(count, () => count)

  return <p>{count}</p>
}

function DoubleCount() {
  const double = () => count * 2

  useDetector(double(), double)

  return <p>{double()}</p>
}

export default function App() {
  return (
    <div>
      <Count />
      <DoubleCount />
      <button onClick={() => count++}>Increment</button>
      <button onClick={() => count--}>Decrement</button>
    </div>
  )
}
```

### Full type definition

```ts
function useValue<T>(
  getValue: () => T,
  compare?: Comparator<T>, // optional
  key?: string // optional
): void
```

```ts
function useDetector<T>(
  oldValue: T,
  getNewValue: () => T,
  compare?: Comparator<T> = (o, n) => o === n, // optional
  key?: string, // optional
): void
```

### License

[The MIT License](./license)

### Author

Arafat Husayn