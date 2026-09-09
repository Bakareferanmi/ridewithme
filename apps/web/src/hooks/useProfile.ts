import { useCallback, useEffect, useState } from 'react'

const PROFILE_KEY = 'ridewithme:profile'

export interface Profile {
  name: string
  email: string
  phone: string
}

const EMPTY_PROFILE: Profile = { name: '', email: '', phone: '' }

function readProfile(): Profile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return EMPTY_PROFILE
    return { ...EMPTY_PROFILE, ...JSON.parse(raw) } as Profile
  } catch {
    return EMPTY_PROFILE
  }
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(() => readProfile())

  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  }, [profile])

  const updateProfile = useCallback((next: Profile) => {
    setProfile(next)
  }, [])

  return { profile, updateProfile }
}
