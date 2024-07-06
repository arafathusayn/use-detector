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
