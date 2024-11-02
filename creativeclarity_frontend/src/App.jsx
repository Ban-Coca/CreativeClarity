import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TaskPage from './page/TaskPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TaskPage />
    </>
  )
}

export default App
