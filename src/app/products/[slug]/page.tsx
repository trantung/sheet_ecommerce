"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import RelatedProducts from "@/components/RelatedProducts"
import AddToCartModal from "@/components/AddToCartModal"
import OrderConfirmationModal from "@/components/OrderConfirmationModal"
import FloatingShoppingBag from "@/components/FloatingShoppingBag"
import { siteServiceApi, type ProductItem, type ProductDetailResponse } from "@/services/api/siteServiceApi"
import { useSiteData } from "@/contexts/SiteDataContext"

// Helper function to transform API product to component format
const transformProductItem = (item: ProductItem) => {
  const price = item.price ? parseFloat(item.price) : 0
  const originalPrice = item.old_price ? parseFloat(item.old_price) : undefined

  // Parse images from JSON string
  let images: string[] = []
  if (item.images) {
    try {
      images = JSON.parse(item.images)
    } catch (e) {
      images = [item.thumbnail]
    }
  } else {
    images = [item.thumbnail]
  }

  return {
    id: item.slug,
    name: item.title,
    sku: item.slug,
    price,
    originalPrice,
    image: images[0] || item.thumbnail || "/placeholder.svg?height=600&width=600",
    thumbnails: images.slice(1),
    description: item.excerpt || item.content || "",
    colors: item.color ? [item.color] : [],
    sizes: item.size ? [item.size] : [],
    images,
  }
}

// Helper function to transform related products
const transformRelatedProduct = (item: ProductItem) => {
  const price = item.price ? parseFloat(item.price) : 0
  const originalPrice = item.old_price ? parseFloat(item.old_price) : undefined

  return {
    id: item.slug,
    name: item.title,
    price,
    originalPrice,
    image: item.thumbnail || "/placeholder.svg?height=300&width=300",
    slug: item.slug,
  }
}

export default function ProductDetail() {
  const params = useParams()
  const slug = params?.slug as string
  const { siteData } = useSiteData()

  const [product, setProduct] = useState<ReturnType<typeof transformProductItem> | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<ReturnType<typeof transformRelatedProduct>[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState("")
  const [showCartModal, setShowCartModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [categoryName, setCategoryName] = useState("")
  const [relatedProductsTitle, setRelatedProductsTitle] = useState("Related Products")

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!slug) return

      // If we already have this product loaded, no need to fetch again
      if (product && product.id === slug) return

      try {
        setLoading(true)
        const response = await siteServiceApi.getProductDetail(slug)

        if (response.detail && response.detail.length > 0) {
          const productData = transformProductItem(response.detail[0])
          setProduct(productData)
          setSelectedImage(productData.image)
          setSelectedSize(productData.sizes[0] || "")
          setSelectedColor(productData.colors[0] || "")

          // Get category name from first category
          if (response.detail[0].category_relate && response.detail[0].category_relate.length > 0) {
            setCategoryName(response.detail[0].category_relate[0].category_name)
          }
        }

        if (response.product_relate) {
          const related = response.product_relate.map(transformRelatedProduct)
          setRelatedProducts(related)
        }

        // Get related products title from siteData if not provided by detail response
        const title = siteServiceApi.getSiteInfoByCode(siteData?.site_informations || [], "related_products")
        if (title) {
          setRelatedProductsTitle(title)
        }
      } catch (error) {
        console.error("Failed to fetch product detail:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetail()
  }, [slug, siteData])

  const handleAddToCart = () => {
    setShowCartModal(true)
  }

  const handleOrderComplete = (orderNo: string) => {
    setOrderNumber(orderNo)
    setShowConfirmationModal(true)
  }

  if (loading) {
    return (
      <div className="block block-content py-20 px-4">
        <div className="block mx-auto max-w-7xl">
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="block block-content py-20 px-4">
        <div className="block mx-auto max-w-7xl text-center">
          <p className="text-gray-600">Product not found</p>
        </div>
      </div>
    )
  }

  // Calculate discount percentage
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const allImages = product.images && product.images.length > 0 ? product.images : [product.image, ...product.thumbnails].filter(Boolean)

  return (
    <div>
      <div className="block block-content py-20 px-4">
        <div className="block mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="block block-breadcrumb">
            <div className="block block-breadcrumb flex space-x-2 items-center mx-auto font-medium text-slate-500 dark:text-navy-300 text-sm">
              <Link href="/">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path>
                </svg>
              </Link>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                </svg>
              </span>
              <Link href="/">{categoryName || "Products"}</Link>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                </svg>
              </span>
              <span className="line-clamp-1" style={{ color: "#16a34a" }}>{product.name}</span>
            </div>
          </div>

          {/* Product */}
          <div className="block block-product mt-10">
            <div className="block grid grid-cols-12">
              {/* Product Images */}
              <div className="block col-span-12 lg:col-span-6">
                <div className="block block-image-main">
                  <div className="relative h-160 w-full">
                    <Image
                      src={selectedImage || product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover object-center rounded"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>
                <div className="block block-image-list mt-4 lg:mt-5">
                  <div className="block flex flex-wrap gap-2">
                    {allImages.map((image, index) => (
                      <span key={index}>
                        <span
                          className={`border-2 block border rounded p-1 cursor-pointer dark:border-navy-450 ${selectedImage === image
                            ? "border-slate-500 dark:border-navy-300 shadow-lg"
                            : "border-slate-300 dark:border-navy-450"
                            }`}
                          onClick={() => setSelectedImage(image)}
                        >
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`${product.name} view ${index + 1}`}
                            width={64}
                            height={64}
                            className="h-16 w-16 object-cover object-center rounded"
                          />
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="block col-span-12 lg:col-span-6 mt-10 lg:mt-0 lg:pl-10">
                <h1 className="text-2xl font-semibold">{product.name}</h1>
                <span className="block text-base text-slate-500 dark:text-navy-300 mt-2">SKU: {product.sku}</span>
                <span className="block text-2xl font-bold font-inter my-4" style={{ color: "#16a34a" }}>
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <div className="block mt-1 flex space-x-2 items-center">
                    {discountPercent > 0 && (
                      <span className="px-1 py-1 rounded-lg font-medium bg-slate-150 text-slate-600 dark:bg-navy-500 dark:text-navy-200">
                        -{discountPercent}%
                      </span>
                    )}
                    <span className="block text-base text-slate-400 dark:text-navy-300 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Size and Color */}
                <div className="block mt-4 flex flex-wrap gap-2">
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="block">
                      <span className="block text-base text-slate-500 dark:text-navy-300">Size</span>
                      <span className="block mt-2">
                        <button
                          className="btn h-8 px-3 py-1 text-xs border border-slate-300 text-slate-600 hover:bg-slate-150 focus:bg-slate-150 dark:border-navy-450 dark:text-navy-200 dark:hover:bg-navy-500 dark:focus:bg-navy-500"
                          onClick={() => setSelectedSize(product.sizes[0])}
                        >
                          {selectedSize || product.sizes[0]}
                        </button>
                      </span>
                    </div>
                  )}
                  {product.colors && product.colors.length > 0 && (
                    <div className="block">
                      <span className="block text-base text-slate-500 dark:text-navy-300">Color</span>
                      <span className="block mt-2">
                        <button
                          className="btn h-8 px-3 py-1 text-xs border border-slate-300 text-slate-600 hover:bg-slate-150 focus:bg-slate-150 dark:border-navy-450 dark:text-navy-200 dark:hover:bg-navy-500 dark:focus:bg-navy-500"
                          onClick={() => setSelectedColor(product.colors[0])}
                        >
                          {selectedColor || product.colors[0]}
                        </button>
                      </span>
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div className="block block-quantity mt-4">
                  <span className="block text-base text-slate-500 dark:text-navy-300">Quantity</span>
                  <div className="block flex space-x-1 mt-2">
                    <button
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className={`btn h-8 px-2 border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 ${quantity <= 1 ? "opacity-50" : ""
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
                </div>

                {/* Add to Cart Button */}
                <div className="block py-10">
                  <button
                    onClick={handleAddToCart}
                    className="btn w-full font-medium text-white"
                    style={{ backgroundColor: "#16a34a" }}
                  >
                    Add to Cart
                  </button>
                </div>

                {/* Description */}
                <div className="block product-description">
                  <div
                    className="text-base text-slate-600 dark:text-navy-300"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="block mx-auto w-full py-20">
        <div className="h-px bg-slate-100 dark:bg-navy-500"></div>
      </div>

      <RelatedProducts products={relatedProducts} title={relatedProductsTitle} />

      <AddToCartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        onOrderComplete={handleOrderComplete}
        product={{
          name: product.name,
          price: product.price,
          image: product.image,
          sku: product.sku,
        }}
        initialQuantity={quantity}
      />

      <OrderConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        orderNumber={orderNumber}
      />

      <FloatingShoppingBag show={true} />
    </div>
  )
}
