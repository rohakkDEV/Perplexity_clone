import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import SettingsModal from './SettingsModal'

const UserMenu = () => {
  const user = useSelector((state) => state.auth.user)
  const { handleLogout } = useAuth()
  const [open, setOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const navigate = useNavigate()

  const onLogout = async () => {
    setOpen(false)
    await handleLogout()
    navigate('/login')
  }

  if (!user) return null
  const initial = user.username?.[0]?.toUpperCase() || '?'

  return (
    <div className="relative mt-3 border-t border-white/8 pt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition hover:bg-white/5"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-400/15 text-sm font-semibold text-teal-200">
          {initial}
        </div>
        <span className="truncate text-sm font-medium text-white/80">{user.username}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="ml-auto text-white/30">
          <path d="M8 9l4-4 4 4M16 15l-4 4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#12151c] shadow-xl">
          <button
            onClick={() => { setOpen(false); setShowSettings(true) }}
            className="block w-full px-3.5 py-2.5 text-left text-sm text-white/75 hover:bg-white/5"
          >
            Settings
          </button>
          <button
            onClick={onLogout}
            className="block w-full border-t border-white/8 px-3.5 py-2.5 text-left text-sm text-red-400 hover:bg-red-400/5"
          >
            Log out
          </button>
        </div>
      )}

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  )
}

export default UserMenu