import { useValue } from "use-detector"

let count = 0

function Count() {
  useValue(() => count)

  return <p>{count}</p>
}

function DoubleCount() {
  const double = useValue(() => count * 2)

  return <p>{double}</p>
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
