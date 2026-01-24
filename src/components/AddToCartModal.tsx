"use client"

import { useEffect, useRef } from "react"
import { useCart } from "@/contexts/CartContext"
import CartModal from "./CartModal"

interface AddToCartModalProps {
  isOpen: boolean
  onClose: () => void
  onOrderComplete: (orderNumber: string) => void
  product: {
    name: string
    price: number
    image: string
    sku?: string
  }
  initialQuantity?: number
}

export default function AddToCartModal({ isOpen, onClose, onOrderComplete, product, initialQuantity = 1 }: AddToCartModalProps) {
  const { addToCart } = useCart()
  const hasAddedToCart = useRef(false)

  // Add product to cart when modal opens (only once)
  useEffect(() => {
    if (isOpen && product.sku && !hasAddedToCart.current) {
      hasAddedToCart.current = true
      addToCart(product.sku, initialQuantity).catch(error => {
        console.error("Failed to add product to cart:", error)
        hasAddedToCart.current = false
      })
    }

    // Reset when modal closes
    if (!isOpen) {
      hasAddedToCart.current = false
    }
  }, [isOpen, product.sku, initialQuantity, addToCart])

  return (
    <CartModal
      isOpen={isOpen}
      onClose={onClose}
      onOrderComplete={onOrderComplete}
    />
  )
}
