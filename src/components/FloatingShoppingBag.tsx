"use client"

import { useState, useEffect } from "react"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface FloatingShoppingBagProps {
    show: boolean
}

export default function FloatingShoppingBag({ show }: FloatingShoppingBagProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [showCartModal, setShowCartModal] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 100 && show)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [show])

    if (!isVisible) return null

    return (
        <>
            <Button
                onClick={() => setShowCartModal(true)}
                className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
                size="icon"
            >
                <ShoppingBag className="h-6 w-6" />
            </Button>

            <Dialog open={showCartModal} onOpenChange={setShowCartModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Your cart</DialogTitle>
                    </DialogHeader>
                    <div className="py-8 text-center text-gray-500">
                        <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Your cart is empty</p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
