import { useState } from 'react'
import { User, Car, Heart, Check, Pencil } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useVehicles } from '../hooks/useVehicles'
import { useFavorites } from '../hooks/useFavorites'
import { useProfile } from '../hooks/useProfile'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export function Profile() {
  const navigate = useNavigate()
  const { myListings } = useVehicles()
  const { favorites } = useFavorites()
  const { profile, updateProfile } = useProfile()

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(profile)

  useDocumentMeta({
    title: 'Profile · RideWithMe',
    description: 'Your RideWithMe account.',
  })

  const initials = profile.name.trim()
    ? profile.name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
    : ''

  const startEditing = () => {
    setDraft(profile)
    setEditing(true)
  }

  const save = () => {
    updateProfile(draft)
    setEditing(false)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Profile</h1>
      </header>

      <div className="profile-card">
        <div className="profile-avatar">
          {initials || <User size={26} strokeWidth={2} />}
        </div>
        <div className="profile-card-body">
          <p className="profile-name">{profile.name.trim() || 'Add your name'}</p>
          <p className="profile-sub">{profile.email.trim() || 'No email set yet'}</p>
        </div>
        {!editing && (
          <button className="profile-edit-btn" onClick={startEditing} aria-label="Edit profile">
            <Pencil size={15} strokeWidth={2} />
          </button>
        )}
      </div>

      {editing && (
        <div className="profile-form">
          <label className="filter-field">
            <span>Full name</span>
            <input
              type="text"
              placeholder="Your name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </label>
          <label className="filter-field">
            <span>Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
            />
          </label>
          <label className="filter-field">
            <span>Phone</span>
            <input
              type="tel"
              placeholder="+234..."
              value={draft.phone}
              onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
            />
          </label>
          <button className="action-btn profile-save-btn" onClick={save}>
            <Check size={16} strokeWidth={2} />
            Save profile
          </button>
        </div>
      )}

      <div className="profile-stats">
        <button className="profile-stat" onClick={() => navigate('/sell')}>
          <Car size={18} strokeWidth={2} />
          <span className="profile-stat-count">{myListings.length}</span>
          <span className="profile-stat-label">My Listings</span>
        </button>
        <button className="profile-stat" onClick={() => navigate('/saved')}>
          <Heart size={18} strokeWidth={2} />
          <span className="profile-stat-count">{favorites.size}</span>
          <span className="profile-stat-label">Saved</span>
        </button>
      </div>
    </div>
  )
}
