'use client'

import React, { useState, useEffect } from 'react'
import Icon from '@/components/ui/Icon'
import { ICONS } from '@/lib/icons'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onClose(id), 300) // Allow time for the fade-out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, id, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Icon name={ICONS.success} className="h-5 w-5 text-green-500" />
      case 'error':
        return <Icon name={ICONS.error} className="h-5 w-5 text-red-500" />
      case 'warning':
        return <Icon name={ICONS.warning} className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Icon name={ICONS.info} className="h-5 w-5 text-blue-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20'
      case 'error':
        return 'bg-red-500/10 border-red-500/20'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20'
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20'
    }
  }

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => onClose(id), 300) // Allow time for the fade-out animation
  }

  return (
    <div
      className={`
        max-w-md w-full bg-secondary border rounded-lg shadow-lg p-4 mb-4
        transition-all duration-300 ${getBackgroundColor()}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {message && <p className="mt-1 text-sm text-gray-400">{message}</p>}
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-300"
        >
          <Icon name={ICONS.close} className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default Toast 