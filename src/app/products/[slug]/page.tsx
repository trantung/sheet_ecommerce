"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Home, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import RelatedProducts from "@/components/RelatedProducts"
import AddToCartModal from "@/components/AddToCartModal"
import OrderConfirmationModal from "@/components/OrderConfirmationModal"
import FloatingShoppingBag from "@/components/FloatingShoppingBag"

const product = {
  id: "1",
  name: "Lavender",
  sku: "123-02",
  price: 50.0,
  originalPrice: 60.0,
  image: "/placeholder.svg?height=600&width=600",
  thumbnails: ["/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"],
  description:
    "Lavender is a fragrant herb with beautiful purple flowers, loved for its calming scent. Ideal for gardens and balconies, it thrives in full sunlight and well-drained soil, adding a touch of serenity to any space.",
  colors: ["L", "Red"],
  sizes: ["L", "Red"],
}

const relatedProducts = [
  {
    id: "2",
    name: "Marigold",
    price: 55.0,
    originalPrice: 70.0,
    image: "/placeholder.svg?height=300&width=300",
    slug: "marigold",
  },
  {
    id: "3",
    name: "Tulip",
    price: 60.0,
    originalPrice: 80.0,
    image: "/placeholder.svg?height=300&width=300",
    slug: "tulip",
  },
  {
    id: "4",
    name: "Lily",
    price: 65.0,
    originalPrice: 85.0,
    image: "/placeholder.svg?height=300&width=300",
    slug: "lily",
  },
]

export default function ProductDetail() {
  const [selectedColor, setSelectedColor] = useState("L")
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(product.image)
  const [showCartModal, setShowCartModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const handleAddToCart = () => {
    setShowCartModal(true)
  }

  const handleOrderComplete = () => {
    setShowConfirmationModal(true)
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Home className="h-4 w-4" />
          <ChevronRight className="h-4 w-4" />
          <Link href="/" className="hover:text-gray-900">
            Flowering plants
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {[product.image, ...product.thumbnails].map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === image ? "border-green-600" : "border-gray-200"
                    }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-600">SKU: {product.sku}</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-green-600">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">-50% $50.00</span>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Size Color</Label>
                <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex gap-4 mt-2">
                  {product.colors.map((color) => (
                    <div key={color} className="flex items-center space-x-2">
                      <RadioGroupItem value={color} id={color} />
                      <Label htmlFor={color}>{color}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium">Quantity</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
              >
                Add to Cart
              </Button>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts products={relatedProducts} />

      <AddToCartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        onOrderComplete={handleOrderComplete}
        product={{
          name: product.name,
          price: product.price,
          image: product.image,
        }}
      />

      <OrderConfirmationModal isOpen={showConfirmationModal} onClose={() => setShowConfirmationModal(false)} />

      <FloatingShoppingBag show={true} />
    </div>
  )
}
