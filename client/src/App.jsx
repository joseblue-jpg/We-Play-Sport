import './App.css'
import { RoutesApp } from './Routes/RoutesApp'
import { ContextProvider } from './Context/ContextProvider'


function App() {

  return (
    <ContextProvider>
      <RoutesApp />
    </ContextProvider>
  )
}

export default App
