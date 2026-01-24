"use client"

import { useState, useEffect } from "react"

export default function BackToTop() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollableHeight = documentHeight - windowHeight

      if (scrollableHeight <= 0) {
        setIsVisible(false)
        setScrollProgress(0)
        return
      }

      const progress = (scrollTop / scrollableHeight) * 100
      setScrollProgress(progress)
      setIsVisible(scrollTop > 0)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!isVisible) return null

  // Calculate circumference and offset for circular progress
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (scrollProgress / 100) * circumference

  return (
    <span className="back-to-top" style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 99 }}>
      <div className="circular-progress-container">
        <svg className="circular-progress" width="50" height="50" viewBox="0 0 50 50" style={{ position: "absolute", left: 0, top: 0, transform: "rotate(-90deg)" }}>
          <circle
            className="circular-progress-background"
            cx="25"
            cy="25"
            r={radius}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="3"
          />
          <circle
            className="circular-progress-bar"
            cx="25"
            cy="25"
            r={radius}
            fill="none"
            stroke="#64748b"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <button onClick={scrollToTop} className="circular-button hover:bg-navy-450 hover:text-white dark:border-sheetany dark:text-navy-100 dark:hover:bg-sheetany-700 dark:hover:text-white">
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        </button>
      </div>
    </span>
  )
}

