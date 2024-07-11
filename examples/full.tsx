import { useValue, useDetector } from "use-detector"

// state to detect/observe
let count = 0

function DoubleCount() {
  // for derived state
  const double = () => count * 2

  useDetector(double(), double)

  return <p>{double()}</p>
}

// state in an object
const state = {
  textInput: "",
}

function TextInput() {
  useValue(() => state.textInput)

  return (
    <input
      value={state.textInput}
      onChange={(e) => {
        state.textInput = e.target.value
      }}
    />
  )
}

// optional compare function, useful for reference types
function compare<T>(prev: T, next: T) {
  return prev === next
}

// optional key
const key = "count"

function Count() {
  useDetector(count, () => count, compare, key)

  return <p>{count}</p>
}

export default function App() {
  return (
    <div>
      <div>
        <Count />
        <DoubleCount />
        <button onClick={() => count++}>Increment</button>
        <button onClick={() => count--}>Decrement</button>
      </div>

      <div>
        <TextInput />
      </div>
    </div>
  )
}
