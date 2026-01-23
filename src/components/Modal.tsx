"use client"

import { ReactNode } from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="block block-modal-checkout bg-white text-slate-900 dark:bg-navy-900 dark:text-white">
      <div className="show modal modal-scale fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" role="dialog">
        <div className="modal-overlay w-full absolute inset-0 bg-slate-900/60" onClick={onClose}></div>
        <div className="max-w-4xl relative flex w-full origin-top flex-col overflow-hidden rounded-lg bg-white dark:bg-navy-700">
          {title && (
            <div className="flex justify-between items-center rounded-t-lg bg-slate-50 px-4 py-2 dark:bg-navy-800">
              <span className="font-bold">{title}</span>
              <button
                onClick={onClose}
                className="btn -mr-1.5 h-7 w-7 rounded-full p-0 hover:bg-slate-300/20 dark:hover:bg-navy-300/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          )}
          <div className="scrollbar-sm overflow-y-auto px-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

