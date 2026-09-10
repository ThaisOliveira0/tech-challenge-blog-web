'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

type PasswordFieldProps = {
  id: string
  value: string
  onChange: (value: string) => void
  autoComplete: string
  label?: string
}

export default function PasswordField({ id, value, onChange, autoComplete, label = 'Senha' }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="field password-field">
      <label htmlFor={id}>{label}</label>
      <div className="password-input-wrap">
        <input id={id} type={isVisible ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} required minLength={6} />
        <button type="button" className="password-toggle" aria-label={isVisible ? 'Ocultar senha' : 'Mostrar senha'} title={isVisible ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setIsVisible((current) => !current)}>
          {isVisible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
    </div>
  )
}
