import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { VehicleDetail } from './pages/VehicleDetail'
import { Saved } from './pages/Saved'
import { Sell } from './pages/Sell'
import { Compare } from './pages/Compare'
import { BottomNav } from './components/BottomNav'
import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vehicle/:id" element={<VehicleDetail />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/sell/:id" element={<Sell />} />
        <Route path="/compare/:ids" element={<Compare />} />
      </Routes>
      <BottomNav />
    </>
  )
}

export default App
