"use client"

import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  slug: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="block rounded-lg text-base" id={product.slug}>
      <Link href={`/products/${product.slug}`} className="block border rounded-lg dark:border-navy-450 overflow-hidden">
        <div className="block block-image">
          {product.image ? (
            <div className="relative w-full aspect-square lg:h-80 overflow-hidden rounded-t-lg">
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover object-center"
                onError={(e) => {
                  const img = e.currentTarget
                  if (img.dataset.error) return
                  img.dataset.error = "1"
                  img.src = "/placeholder.svg"
                }}
              />
            </div>
          ) : (
            <div className="w-full aspect-square lg:h-80 bg-gray-100 rounded-t-lg flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div className="block p-4">
          <span className="block font-semibold line-clamp-2">{product.name}</span>
          <div className="block mt-2">
            <div className="block mt-1 flex space-x-2 items-center">
              <span className="block font-semibold" style={{ color: "#16a34a" }}>
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="block text-slate-400 dark:text-navy-300 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
