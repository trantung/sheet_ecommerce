"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Modal from "./Modal"
import { siteServiceApi, type SiteData } from "@/services/api/siteServiceApi"

interface AddToCartModalProps {
  isOpen: boolean
  onClose: () => void
  onOrderComplete: () => void
  product: {
    name: string
    price: number
    image: string
    sku?: string
  }
}

export default function AddToCartModal({ isOpen, onClose, onOrderComplete, product }: AddToCartModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [discountCode, setDiscountCode] = useState("")
  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  })

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const response = await siteServiceApi.getSiteData()
        if (response.status) {
          setSiteData(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch site data:", error)
      }
    }
    fetchSiteData()
  }, [])

  const getSiteInfo = (code: string) => {
    return siteServiceApi.getSiteInfoByCode(siteData?.site_informations || [], code)
  }

  const subtotal = product.price * quantity
  const discount = 0
  const shippingFee = getSiteInfo("shipping_fee") ? parseFloat(getSiteInfo("shipping_fee")) : 0
  const shipping = shippingFee
  const total = subtotal - discount + shipping

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onOrderComplete()
    onClose()
  }

  const handleApplyDiscount = () => {
    // TODO: Implement discount logic
  }

  // Get labels from site_informations
  const checkoutTitle = getSiteInfo("checkout_modal") || "Checkout"
  const yourCartTitle = getSiteInfo("your_cart") || "Your cart"
  const orderInfoTitle = getSiteInfo("order_information") || "Order Information"
  const orderSummaryTitle = getSiteInfo("order_summary") || "Order Summary"
  const orderNameLabel = getSiteInfo("order_name") || "Full name"
  const orderEmailLabel = getSiteInfo("order_email") || "Email address"
  const orderPhoneLabel = getSiteInfo("order_phone") || "Phone number"
  const orderAddressLabel = getSiteInfo("order_address") || "Address"
  const orderNoteLabel = getSiteInfo("order_note") || "Note"
  const discountCodeLabel = getSiteInfo("order_discount_code") || "Discount code"
  const applyLabel = getSiteInfo("order_apply") || "Apply"
  const subtotalLabel = getSiteInfo("order_subtotal") || "Subtotal"
  const discountLabel = getSiteInfo("order_discount") || "Discount"
  const shippingLabel = getSiteInfo("order_shipping") || "Shipping"
  const totalLabel = getSiteInfo("order_total") || "Total"
  const orderSubmitLabel = getSiteInfo("order_submit") || "Order"
  const continueShoppingLabel = getSiteInfo("continue_shopping") || "Continue shopping"

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={checkoutTitle}>
      <div className="block cart-info py-5">
        <div className="block block-cart">
          <span className="block font-semibold text-xl">{yourCartTitle}</span>
          <div className="block block-items">
            <div className="block mt-3">
              <div className="block block-item grid grid-cols-2 items-center">
                <div className="block block-item-image flex space-x-2 items-center">
                  <span className="block">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="w-12 h-12 lg:w-16 lg:h-16 object-center object-cover rounded-lg"
                    />
                  </span>
                  <span className="block">
                    <span className="block font-medium text-base line-clamp-1">{product.name}</span>
                    <span className="block text-slate-500 dark:text-navy-300 text-xs+"> SKU: {product.sku || "N/A"}</span>
                    <span className="block text-base font-medium">${product.price.toFixed(2)}</span>
                  </span>
                </div>
                <div className="block flex justify-between items-center">
                  <div className="block block-item-quantity flex space-x-1 mt-2 items-center">
                    <button
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className={`btn h-8 px-2 border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 ${
                        quantity <= 1 ? "opacity-50" : ""
                      }`}
                    >
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14"></path>
                        </svg>
                      </span>
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1
                        setQuantity(Math.max(1, val))
                      }}
                      className="form-input h-8 w-12 text-center rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 dark:border-navy-450 dark:hover:border-navy-400"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="btn h-8 px-2 border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500"
                    >
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15"></path>
                        </svg>
                      </span>
                    </button>
                  </div>
                  <div className="block block-item-price">
                    <div className="block flex space-x-4 items-center">
                      <span className="font-semibold text-base">${(product.price * quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="block mx-auto w-full mt-10">
          <div className="h-px bg-slate-100 dark:bg-navy-500"></div>
        </div>
        <div className="block block-info py-10">
          <form onSubmit={handleSubmit} method="POST">
            <div className="block grid grid-cols-12 gap-10">
              <div className="block col-span-12 lg:col-span-7">
                <span className="block font-semibold text-xl">{orderInfoTitle}</span>
                <div className="block-input mt-5">
                  <label className="block">
                    <span>
                      {orderNameLabel} <span className="text-error">*</span>
                    </span>
                    <span className="relative mt-1.5 flex">
                      <input
                        className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-slate-500 dark:border-navy-450 dark:hover:border-navy-400"
                        type="text"
                        name="name"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </span>
                  </label>
                  <label className="block mt-4">
                    <span>
                      {orderEmailLabel} <span className="text-error">*</span>
                    </span>
                    <span className="relative mt-1.5 flex">
                      <input
                        className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-slate-500 dark:border-navy-450 dark:hover:border-navy-400"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </span>
                  </label>
                  <label className="block mt-4">
                    <span>{orderPhoneLabel}</span>
                    <span className="relative mt-1.5 flex">
                      <input
                        className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-slate-500 dark:border-navy-450 dark:hover:border-navy-400"
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </span>
                  </label>
                  <label className="block mt-4">
                    <span>
                      {orderAddressLabel} <span className="text-error">*</span>
                    </span>
                    <span className="relative mt-1.5 flex">
                      <input
                        className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-slate-500 dark:border-navy-450 dark:hover:border-navy-400"
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </span>
                  </label>
                  <label className="block mt-4">
                    <span>{orderNoteLabel}</span>
                    <textarea
                      name="note"
                      rows={3}
                      placeholder=""
                      className="form-textarea mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-slate-500 dark:border-navy-450 dark:hover:border-navy-400"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    ></textarea>
                  </label>
                </div>
              </div>
              <div className="block col-span-12 lg:col-span-5">
                <span className="block font-semibold text-xl">{orderSummaryTitle}</span>
                <div className="block mt-5">
                  <div className="block block-coupon">
                    <div className="relative flex -space-x-px keyword-index">
                      <input
                        className="form-input peer uppercase w-full rounded-l-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 dark:border-navy-450 dark:hover:border-navy-400"
                        placeholder={discountCodeLabel}
                        name="coupon"
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleApplyDiscount}
                        className="btn rounded-l-none border-l-0 border border-slate-300 dark:border-navy-450 bg-slate-50 dark:bg-navy-600"
                      >
                        <span>{applyLabel}</span>
                      </button>
                    </div>
                  </div>
                  <div className="block block-summary mt-5">
                    <div className="block p-4 bg-slate-50 dark:bg-navy-600 rounded-lg block-summary-order space-y-4">
                      <div className="block flex justify-between">
                        <span>{subtotalLabel}</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="block flex justify-between">
                        <span>{discountLabel}</span>
                        <span className="font-medium">-${discount.toFixed(2)}</span>
                      </div>
                      <div className="block flex justify-between">
                        <span>{shippingLabel}</span>
                        <span className="font-medium">${shipping.toFixed(2)}</span>
                      </div>
                      <div className="block mx-auto w-full mt-10">
                        <div className="h-px bg-slate-200 dark:bg-navy-500"></div>
                      </div>
                      <div className="block flex justify-between">
                        <span className="text-base font-medium">{totalLabel}</span>
                        <span className="text-lg font-bold">${total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="block block-action-checkout">
                      <div className="block mt-5">
                        <button type="submit" className="btn w-full font-medium text-white space-x-2" style={{ backgroundColor: "#16a34a" }}>
                          <span>{orderSubmitLabel}</span>
                        </button>
                      </div>
                      <div className="block mt-5 text-center hover:underline cursor-pointer text-slate-500 dark:text-navy-300" onClick={onClose}>
                        <span>{continueShoppingLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
}
