/**
 * Utility functions for accessibility features in the application
 */

/**
 * Focus trap to keep focus within a modal or dialog
 * Useful for modals, dialogs, and other interactive components
 * @param {HTMLElement} element - The element to trap focus within
 * @returns {() => void} - Function to remove the focus trap
 */
export function createFocusTrap(element: HTMLElement): () => void {
  const focusableSelectors = [
    'a[href]:not([disabled])',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ]

  const focusableElements = Array.from(
    element.querySelectorAll(focusableSelectors.join(','))
  ) as HTMLElement[]

  if (focusableElements.length === 0) return () => {}

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  // Set initial focus
  firstElement.focus()

  const handleKeyDown = (e: KeyboardEvent) => {
    // If not Tab key, do nothing
    if (e.key !== 'Tab') return

    // If Shift+Tab on first element, move to last element
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault()
      lastElement.focus()
    }
    // If Tab on last element, move to first element
    else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault()
      firstElement.focus()
    }
  }

  element.addEventListener('keydown', handleKeyDown)
  return () => element.removeEventListener('keydown', handleKeyDown)
}

/**
 * Set focus to an element when it's mounted
 * Useful for modals, alerts, and notifications
 * @param {HTMLElement} element - The element to focus
 * @param {boolean} [restoreFocus=true] - Whether to restore focus to the previously focused element when unmounting
 * @returns {() => void} - Function to restore focus
 */
export function setFocus(element: HTMLElement, restoreFocus = true): () => void {
  const previouslyFocused = document.activeElement as HTMLElement
  element.focus()

  return () => {
    if (restoreFocus && previouslyFocused) {
      previouslyFocused.focus()
    }
  }
}

/**
 * Get the visible text of an element
 * Useful for screen readers to announce the content of non-text elements
 * @param {HTMLElement} element - The element to get text from
 * @returns {string} - The visible text content
 */
export function getVisibleText(element: HTMLElement): string {
  if (!element) return ''

  // Clone element to avoid modifying the original
  const clone = element.cloneNode(true) as HTMLElement

  // Remove hidden elements
  Array.from(clone.querySelectorAll('[aria-hidden="true"], [hidden], [style*="display: none"]')).forEach(
    (hiddenElement) => hiddenElement.remove()
  )

  return clone.textContent || ''
}

/**
 * Announce a message to screen readers
 * @param {string} message - The message to announce
 * @param {'assertive' | 'polite'} [priority='assertive'] - The priority of the announcement
 */
export function announceToScreenReader(message: string, priority: 'assertive' | 'polite' = 'assertive'): void {
  // Create or get the announcement container
  let container = document.getElementById('screen-reader-announcer')

  if (!container) {
    container = document.createElement('div')
    container.id = 'screen-reader-announcer'
    container.setAttribute('aria-live', priority)
    container.setAttribute('aria-atomic', 'true')
    container.setAttribute('role', 'status')
    container.style.border = '0'
    container.style.clip = 'rect(0 0 0 0)'
    container.style.height = '1px'
    container.style.margin = '-1px'
    container.style.overflow = 'hidden'
    container.style.padding = '0'
    container.style.position = 'absolute'
    container.style.width = '1px'
    document.body.appendChild(container)
  }

  // Update container with the message
  container.textContent = ''
  // Force a DOM reflow
  setTimeout(() => {
    container.textContent = message
  }, 50)
}

/**
 * Check if an element is keyboard-navigable
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - Whether the element is keyboard-navigable
 */
export function isKeyboardNavigable(element: HTMLElement): boolean {
  if (!element) return false

  // Check if the element is disabled
  if (element.hasAttribute('disabled')) return false
  if (element.getAttribute('aria-disabled') === 'true') return false

  // Check if the element is hidden
  if (element.hasAttribute('hidden')) return false
  if (element.getAttribute('aria-hidden') === 'true') return false
  if (window.getComputedStyle(element).display === 'none') return false
  if (window.getComputedStyle(element).visibility === 'hidden') return false

  // Check if the element is focusable
  const tabIndex = element.getAttribute('tabindex')
  if (tabIndex === '-1') return false

  // Check if the element is a common interactive element
  const tagName = element.tagName.toLowerCase()
  const interactiveElements = ['a', 'button', 'input', 'select', 'textarea']
  if (interactiveElements.includes(tagName)) return true

  // Check for role attributes
  const role = element.getAttribute('role')
  const interactiveRoles = ['button', 'link', 'checkbox', 'menuitem', 'tab', 'radio']
  if (role && interactiveRoles.includes(role)) return true

  return false
}

/**
 * Check if an element has sufficient color contrast
 * This is a simple approximation, for thorough checks use proper a11y tools
 * @param {string} foreground - The foreground color in hex format (#RRGGBB)
 * @param {string} background - The background color in hex format (#RRGGBB)
 * @returns {boolean} - Whether the contrast is sufficient
 */
export function hasEnoughContrast(foreground: string, background: string): boolean {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b)
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex)
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : [0, 0, 0]
  }

  // Calculate relative luminance
  const calculateLuminance = (rgb: number[]) => {
    const [r, g, b] = rgb.map((c) => {
      const value = c / 255
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const foregroundRgb = hexToRgb(foreground)
  const backgroundRgb = hexToRgb(background)

  const foregroundLuminance = calculateLuminance(foregroundRgb)
  const backgroundLuminance = calculateLuminance(backgroundRgb)

  // Calculate contrast ratio
  const contrast =
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)

  // WCAG 2.1 requires a contrast ratio of at least 4.5:1 for normal text
  // and 3:1 for large text (14pt bold or 18pt regular)
  return contrast >= 4.5
} 