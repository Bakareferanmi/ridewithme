import { Route, Routes, useLocation } from 'react-router-dom'
import { Welcome } from './pages/Welcome'
import { Home } from './pages/Home'
import { VehicleDetail } from './pages/VehicleDetail'
import { Saved } from './pages/Saved'
import { Sell } from './pages/Sell'
import { BottomNav } from './components/BottomNav'
import './App.css'

function App() {
  const location = useLocation()
  const showBottomNav = location.pathname !== '/'

  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/browse" element={<Home />} />
        <Route path="/vehicle/:id" element={<VehicleDetail />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/sell/:id" element={<Sell />} />
      </Routes>
      {showBottomNav && <BottomNav />}
    </>
  )
}

export default App
