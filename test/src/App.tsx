import { useValue } from "../../src/index"

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
