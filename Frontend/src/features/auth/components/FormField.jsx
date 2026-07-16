import React from 'react'

const FormField = ({ label, error, ...inputProps }) => {
  return (
    <div>
      <label htmlFor={inputProps.id} className="mb-1.5 block text-[13px] font-medium text-white/70">
        {label}
      </label>
      <input
        {...inputProps}
        className="w-full rounded-lg border border-white/10 bg-black/25 px-3.5 py-2.5 text-[15px] text-white placeholder:text-white/25 outline-none transition focus:border-teal-400/50 focus:bg-black/40 focus:ring-2 focus:ring-teal-400/15"
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  )
}

export default FormField