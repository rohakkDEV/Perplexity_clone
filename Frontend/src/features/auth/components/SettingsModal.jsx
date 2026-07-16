import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useAuth } from '../hook/useAuth'

const SettingsModal = ({ onClose }) => {
  const user = useSelector((state) => state.auth.user)
  const { handleUpdateProfile, handleChangePassword } = useAuth()

  const [username, setUsername] = useState(user?.username || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [profileMsg, setProfileMsg] = useState(null)
  const [passwordMsg, setPasswordMsg] = useState(null)

  const submitProfile = async (e) => {
    e.preventDefault()
    setProfileMsg(null)
    const result = await handleUpdateProfile({ username })
    setProfileMsg(result.success ? 'Username updated.' : result.message)
  }

  const submitPassword = async (e) => {
    e.preventDefault()
    setPasswordMsg(null)
    const result = await handleChangePassword({ currentPassword, newPassword })
    if (result.success) {
      setPasswordMsg('Password changed.')
      setCurrentPassword('')
      setNewPassword('')
    } else {
      setPasswordMsg(result.message)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4' onClick={onClose}>
      <div
        className='w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0f17] p-6 shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='mb-6 flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-white'>Settings</h2>
          <button onClick={onClose} className='text-white/50 hover:text-white'>✕</button>
        </div>

        <div className='mb-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70'>
          <p><span className='text-white/50'>Email:</span> {user?.email}</p>
          <p className='mt-1'><span className='text-white/50'>Verified:</span> {user?.verified ? 'Yes' : 'No'}</p>
        </div>

        <form onSubmit={submitProfile} className='mb-6 space-y-2'>
          <label className='text-sm font-medium text-white/80'>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-[#31b8c6]'
          />
          <button type='submit' className='mt-2 w-full rounded-lg bg-[#31b8c6] px-4 py-2 font-medium text-black hover:bg-[#45c7d4]'>
            Save Username
          </button>
          {profileMsg && <p className='text-xs text-white/60'>{profileMsg}</p>}
        </form>

        <form onSubmit={submitPassword} className='space-y-2 border-t border-white/10 pt-5'>
          <label className='text-sm font-medium text-white/80'>Current Password</label>
          <input
            type='password'
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className='w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-[#31b8c6]'
          />
          <label className='text-sm font-medium text-white/80'>New Password</label>
          <input
            type='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className='w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-[#31b8c6]'
          />
          <button type='submit' className='mt-2 w-full rounded-lg border border-white/30 px-4 py-2 font-medium text-white hover:bg-white/10'>
            Change Password
          </button>
          {passwordMsg && <p className='text-xs text-white/60'>{passwordMsg}</p>}
        </form>
      </div>
    </div>
  )
}

export default SettingsModal