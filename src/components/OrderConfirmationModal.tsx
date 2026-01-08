"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface OrderConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function OrderConfirmationModal({ isOpen, onClose }: OrderConfirmationModalProps) {
  const orderNumber = "#2924231"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Thanks for your order!</h2>
          <p className="text-gray-600">
            Your order has been placed and will be processed as soon as possible. Make sure you make note of your order
            number, which is <strong>{orderNumber}</strong>
          </p>
          <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700">
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
