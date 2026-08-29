import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { VehicleDetail } from './pages/VehicleDetail'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/vehicle/:id" element={<VehicleDetail />} />
    </Routes>
  )
}

export default App
