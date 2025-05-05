'use client'

import { useEffect, useRef, useCallback } from 'react'
import { 
  createFocusTrap, 
  setFocus, 
  announceToScreenReader 
} from '@/lib/a11y'

/**
 * Hook for handling accessibility concerns in components
 * Provides functions for focus management, screen reader announcements, etc.
 */
export function useA11y() {
  const elementRef = useRef<HTMLElement | null>(null)
  const focusTrapRef = useRef<(() => void) | null>(null)
  const restoreFocusRef = useRef<(() => void) | null>(null)

  /**
   * Set up a focus trap
   * @param element The element to trap focus in, defaults to elementRef.current
   */
  const trapFocus = useCallback((element?: HTMLElement) => {
    const targetElement = element || elementRef.current
    if (!targetElement) return
    
    // Clean up any existing focus trap
    if (focusTrapRef.current) {
      focusTrapRef.current()
    }
    
    // Create new focus trap
    focusTrapRef.current = createFocusTrap(targetElement)
  }, [])

  /**
   * Remove the focus trap
   */
  const removeFocusTrap = useCallback(() => {
    if (focusTrapRef.current) {
      focusTrapRef.current()
      focusTrapRef.current = null
    }
  }, [])

  /**
   * Focus an element
   * @param element The element to focus, defaults to elementRef.current
   * @param shouldRestoreFocus Whether to restore focus when unmounting
   */
  const focusElement = useCallback((element?: HTMLElement, shouldRestoreFocus = true) => {
    const targetElement = element || elementRef.current
    if (!targetElement) return
    
    // Clean up any existing focus handlers
    if (restoreFocusRef.current) {
      restoreFocusRef.current()
    }
    
    // Create new focus handler
    restoreFocusRef.current = setFocus(targetElement, shouldRestoreFocus)
  }, [])

  /**
   * Restore focus to the previously focused element
   */
  const restoreFocus = useCallback(() => {
    if (restoreFocusRef.current) {
      restoreFocusRef.current()
      restoreFocusRef.current = null
    }
  }, [])

  /**
   * Announce a message to screen readers
   * @param message The message to announce
   * @param priority The priority of the announcement
   */
  const announce = useCallback((message: string, priority: 'assertive' | 'polite' = 'assertive') => {
    announceToScreenReader(message, priority)
  }, [])

  /**
   * Clean up on unmount
   */
  useEffect(() => {
    return () => {
      removeFocusTrap()
      restoreFocus()
    }
  }, [removeFocusTrap, restoreFocus])

  return {
    elementRef,
    trapFocus,
    removeFocusTrap,
    focusElement,
    restoreFocus,
    announce,
  }
} 