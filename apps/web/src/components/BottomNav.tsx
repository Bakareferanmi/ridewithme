import { NavLink } from 'react-router-dom'
import { Compass, Heart, PlusCircle } from 'lucide-react'

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => `bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`}>
        <Compass size={19} strokeWidth={2} />
        <span>Browse</span>
      </NavLink>
      <NavLink to="/saved" className={({ isActive }) => `bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`}>
        <Heart size={19} strokeWidth={2} />
        <span>Saved</span>
      </NavLink>
      <NavLink to="/sell" className={({ isActive }) => `bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`}>
        <PlusCircle size={19} strokeWidth={2} />
        <span>Sell</span>
      </NavLink>
    </nav>
  )
}
