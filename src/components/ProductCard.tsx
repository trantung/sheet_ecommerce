"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

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
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/products/${product.slug}`}>
      <div
        className={`group cursor-pointer transition-transform hover:scale-105 border border-gray-200 rounded-lg p-4 bg-white ${
          isHovered ? "shadow-lg" : "shadow-sm"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-green-600 font-semibold">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-gray-400 line-through text-sm">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
