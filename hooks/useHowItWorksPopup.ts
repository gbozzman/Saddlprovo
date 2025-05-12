"use client"

import { useState, useEffect } from "react"

export function useHowItWorksPopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if the popup should be shown
    const hidePopup = localStorage.getItem("hideHowItWorksPopup")

    // If user hasn't chosen to hide it, show it on first load
    if (!hidePopup) {
      // Small delay to ensure smooth animation after page load
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  const openPopup = () => setIsOpen(true)
  const closePopup = () => setIsOpen(false)

  return { isOpen, openPopup, closePopup }
}
