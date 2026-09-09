import { NavLink } from 'react-router-dom'
import { Home, Search, Heart, User, Plus } from 'lucide-react'

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/browse" end className={({ isActive }) => `bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`}>
        <Home size={20} strokeWidth={2} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/search" className={({ isActive }) => `bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`}>
        <Search size={20} strokeWidth={2} />
        <span>Search</span>
      </NavLink>

      <NavLink to="/sell" className="bottom-nav-fab-wrap" aria-label="Sell a vehicle">
        <span className="bottom-nav-fab">
          <Plus size={24} strokeWidth={2.5} />
        </span>
      </NavLink>

      <NavLink to="/saved" className={({ isActive }) => `bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`}>
        <Heart size={20} strokeWidth={2} />
        <span>Saved</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`}>
        <User size={20} strokeWidth={2} />
        <span>Profile</span>
      </NavLink>
    </nav>
  )
}
