'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  title: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (title: string, message: string, type: ToastType) => void
  removeToast: (id: string) => void
}

interface ToastActionsValue {
  success: (title: string, message: string) => void
  error: (title: string, message: string) => void
  info: (title: string, message: string) => void
  warning: (title: string, message: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)
const ToastActionsContext = createContext<ToastActionsValue | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function useToastActions() {
  const context = useContext(ToastActionsContext)
  if (!context) {
    throw new Error('useToastActions must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((title: string, message: string, type: ToastType) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, title, message, type }])
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback((title: string, message: string) => {
    addToast(title, message, 'success')
  }, [addToast])

  const error = useCallback((title: string, message: string) => {
    addToast(title, message, 'error')
  }, [addToast])

  const info = useCallback((title: string, message: string) => {
    addToast(title, message, 'info')
  }, [addToast])

  const warning = useCallback((title: string, message: string) => {
    addToast(title, message, 'warning')
  }, [addToast])

  const toastActions = {
    success,
    error,
    info,
    warning
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      <ToastActionsContext.Provider value={toastActions}>
        {children}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </ToastActionsContext.Provider>
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`rounded-lg p-4 text-white shadow-lg flex gap-3 items-start animate-slideIn ${getBackgroundColor(toast.type)}`}
        >
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{toast.title}</h4>
            <p className="text-sm mt-1">{toast.message}</p>
          </div>
          <button 
            type="button"
            onClick={() => removeToast(toast.id)}
            className="text-white/80 hover:text-white"
            aria-label="Close toast"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  )
}

function getBackgroundColor(type: ToastType): string {
  switch (type) {
    case 'success':
      return 'bg-green-600'
    case 'error':
      return 'bg-red-600'
    case 'warning':
      return 'bg-amber-600'
    case 'info':
      return 'bg-blue-600'
  }
}

// Add slide-in animation to tailwind config
// @keyframes slideIn {
//   from {
//     transform: translateX(100%);
//     opacity: 0;
//   }
//   to {
//     transform: translateX(0);
//     opacity: 1;
//   }
// } 