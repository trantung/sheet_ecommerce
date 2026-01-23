"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import Banner from "@/components/Banner"
import ProductList from "@/components/ProductList"
import SearchAndFilters from "@/components/SearchAndFilters"
import ProductCard from "@/components/ProductCard"
import FloatingShoppingBag from "@/components/FloatingShoppingBag"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { siteServiceApi, type SiteData, type Product as ApiProduct } from "@/services/api/siteServiceApi"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  slug: string
}

// Helper function to transform API product to component product format
const transformProduct = (apiProduct: ApiProduct): Product => {
  // Use price from API, fallback to 0 if not provided
  const price = apiProduct.price ? parseFloat(apiProduct.price) : 0
  const originalPrice = apiProduct.old_price ? parseFloat(apiProduct.old_price) : undefined

  return {
    id: apiProduct.slug,
    name: apiProduct.title,
    price,
    originalPrice,
    image: apiProduct.thumbnail || "/placeholder.svg?height=300&width=300",
    slug: apiProduct.slug,
  }
}

// Helper function to get all products from categories
const getAllProductsFromCategories = (siteData: SiteData | null): Product[] => {
  if (!siteData || !siteData.categories) return []

  const allApiProducts: ApiProduct[] = []
  siteData.categories.forEach((category) => {
    if (category.products && Array.isArray(category.products)) {
      allApiProducts.push(...category.products)
    }
  })

  // Remove duplicates by slug
  const uniqueProducts = allApiProducts.filter(
    (product, index, self) => index === self.findIndex((p) => p.slug === product.slug)
  )

  return uniqueProducts.map((product) => transformProduct(product))
}

// Helper function to filter products by new_arrival flag (1 = true, 2 = false)
const getNewArrivals = (siteData: SiteData | null): Product[] => {
  if (!siteData || !siteData.categories) return []

  const newArrivalProducts: ApiProduct[] = []
  siteData.categories.forEach((category) => {
    if (category.products && Array.isArray(category.products)) {
      const filtered = category.products.filter((p) => p.new_arrival === 1)
      newArrivalProducts.push(...filtered)
    }
  })

  // Remove duplicates by slug
  const uniqueProducts = newArrivalProducts.filter(
    (product, index, self) => index === self.findIndex((p) => p.slug === product.slug)
  )

  return uniqueProducts.map((product) => transformProduct(product))
}

// Helper function to filter products by best_selling flag (1 = true, 2 = false)
const getBestSelling = (siteData: SiteData | null): Product[] => {
  if (!siteData || !siteData.categories) return []

  const bestSellingProducts: ApiProduct[] = []
  siteData.categories.forEach((category) => {
    if (category.products && Array.isArray(category.products)) {
      const filtered = category.products.filter((p) => p.best_selling === 1)
      bestSellingProducts.push(...filtered)
    }
  })

  // Remove duplicates by slug
  const uniqueProducts = bestSellingProducts.filter(
    (product, index, self) => index === self.findIndex((p) => p.slug === product.slug)
  )

  return uniqueProducts.map((product) => transformProduct(product))
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [email, setEmail] = useState("")
  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const response = await siteServiceApi.getSiteData()
        if (response.status) {
          setSiteData(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch site data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSiteData()
  }, [])

  const getSiteInfo = (code: string) => {
    return siteServiceApi.getSiteInfoByCode(siteData?.site_informations || [], code)
  }

  // Get site information with fallbacks
  const newArrivalsTitle = getSiteInfo("new_arrivals") || "New Arrivals"
  const bestSellingTitle = getSiteInfo("best_selling_products") || "Best Selling Products"
  const allProductsTitle = getSiteInfo("all_products") || "All Products"
  const emailSubscriptionTitle = getSiteInfo("email_subscription_title") || "Join Our Email List"
  const emailSubscriptionSubtitle = getSiteInfo("email_subscription_subtitle") || "Sign up to receive the latest products directly in your inbox"

  // Get products from API
  const allProducts = useMemo(() => {
    return getAllProductsFromCategories(siteData)
  }, [siteData])

  // Get newArrivals and bestSelling based on flags from API
  const newArrivals = useMemo(() => {
    return getNewArrivals(siteData)
  }, [siteData])

  const bestSelling = useMemo(() => {
    return getBestSelling(siteData)
  }, [siteData])

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filter by category
    if (selectedCategory !== "all" && siteData?.categories) {
      const category = siteData.categories.find((cat) => cat.category_name.toLowerCase() === selectedCategory.toLowerCase())
      if (category) {
        const categoryProductSlugs = new Set(category.products.map((p) => p.slug))
        filtered = filtered.filter((product) => categoryProductSlugs.has(product.slug))
      }
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Keep original order for featured
        break
    }

    return filtered
  }, [searchTerm, selectedCategory, sortBy, allProducts, siteData])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Thank you for subscribing with email: ${email}`)
    setEmail("")
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Banner Skeleton */}
        <section className="relative h-96 bg-gradient-to-r from-slate-400 to-slate-500 overflow-hidden animate-pulse">
          <div className="absolute inset-0 bg-gray-300"></div>
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center">
            <div className="space-y-4 w-full max-w-2xl">
              <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Product Lists Skeleton */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="h-8 bg-gray-300 rounded w-48 mb-8 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 bg-white animate-pulse">
                  <div className="aspect-square bg-gray-300 rounded-lg mb-3"></div>
                  <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="h-8 bg-gray-300 rounded w-48 mb-8 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 bg-white animate-pulse">
                  <div className="aspect-square bg-gray-300 rounded-lg mb-3"></div>
                  <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Products Section Skeleton */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="h-8 bg-gray-300 rounded w-32 animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded w-48 animate-pulse"></div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 h-10 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-full md:w-48 h-10 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-full md:w-48 h-10 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 bg-white animate-pulse">
                  <div className="aspect-square bg-gray-300 rounded-lg mb-3"></div>
                  <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section Skeleton */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-96 mx-auto mb-8 animate-pulse"></div>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="flex-1 h-12 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-12 w-32 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      <Banner />
      {newArrivals.length > 0 && <ProductList products={newArrivals} title={newArrivalsTitle} />}
      {bestSelling.length > 0 && <ProductList products={bestSelling} title={bestSellingTitle} />}

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">{allProductsTitle}</h2>
            <span className="text-gray-600">
              Showing {filteredProducts.length} of {allProducts.length} products
            </span>
          </div>
          <SearchAndFilters
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            onSortChange={setSortBy}
            categories={siteData?.categories || []}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{emailSubscriptionTitle}</h2>
          <p className="text-gray-600 mb-8">{emailSubscriptionSubtitle}</p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" className="bg-green-600 text-white px-8 py-3 hover:bg-green-700 transition-colors">
              Subscribe Now →
            </Button>
          </form>
        </div>
      </section>

      <FloatingShoppingBag show={true} />
    </div>
  )
}
