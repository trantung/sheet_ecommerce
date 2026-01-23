"use client"

import { useState } from "react"
import Modal from "./Modal"

interface FloatingShoppingBagProps {
    show: boolean
}

export default function FloatingShoppingBag({ show }: FloatingShoppingBagProps) {
    const [showCartModal, setShowCartModal] = useState(false)

    if (!show) return null

    return (
        <>
            <div className="block block-card-order">
                <span className="card-order" style={{ position: "fixed", top: "100px", right: "40px", zIndex: 99 }}>
                    <button
                        onClick={() => setShowCartModal(true)}
                        className="btn w-12 h-12 border rounded-full bg-slate-50 dark:bg-sheetany border-2 border-slate-300 p-2 text-slate-600 hover:bg-navy-450 hover:text-white dark:border-sheetany dark:text-navy-100 dark:hover:bg-sheetany-700 dark:hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"></path>
                        </svg>
                    </button>
                </span>
            </div>

            <Modal isOpen={showCartModal} onClose={() => setShowCartModal(false)} title="Checkout">
                <div className="block cart-info py-5">
                    <div className="block block-cart">
                        <span className="block font-semibold text-xl">Your cart</span>
                        <div className="block flex mx-auto justify-center p-5">
                            <div className="block text-base flex space-x-2 text-slate-500 dark:text-navy-300">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"></path>
                                    </svg>
                                </span>
                                <span className="item-empty">Your cart is empty</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}
