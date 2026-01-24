"use client"

import { useSiteData } from "@/contexts/SiteDataContext"
import { siteServiceApi } from "@/services/api/siteServiceApi"
import Modal from "./Modal"

interface OrderConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  orderNumber?: string
}

export default function OrderConfirmationModal({ isOpen, onClose, orderNumber }: OrderConfirmationModalProps) {
  const { siteData } = useSiteData()

  const getSiteInfo = (code: string) => {
    return siteServiceApi.getSiteInfoByCode(siteData?.site_informations || [], code)
  }

  const checkoutTitle = getSiteInfo("checkout_modal") || "Checkout"
  const orderMessageTitle = getSiteInfo("order_message_title") || "Thanks for your order!"
  const orderMessageDescription = getSiteInfo("order_message_description") || "Your order has been placed and will be processed as soon as possible. Make sure you make note of your order number, which is"

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={checkoutTitle}>
      <div className="block">
        <div className="block px-8 py-20 mx-auto justify-center text-center w-full">
          <div className="block mx-auto max-w-2xl">
            <span className="block flex justify-center text-success">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"></path>
              </svg>
            </span>
            <h2 className="block text-2xl font-bold mt-5">{orderMessageTitle}</h2>
            <p className="text-base mt-5">
              {orderMessageDescription} <span className="font-bold">{orderNumber}</span>.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}
