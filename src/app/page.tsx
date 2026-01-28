"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import Banner from "@/components/Banner"
import ProductList from "@/components/ProductList"
import SearchAndFilters from "@/components/SearchAndFilters"
import ProductCard from "@/components/ProductCard"
// import FloatingShoppingBag from "@/components/FloatingShoppingBag"
import { siteServiceApi, type SiteData, type Product as ApiProduct, type ProductItem } from "@/services/api/siteServiceApi"
import { useSiteData } from "@/contexts/SiteDataContext"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  slug: string
}

// Helper function to transform API product to component product format
const transformProduct = (apiProduct: ApiProduct | ProductItem): Product => {
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
  const [sortBy, setSortBy] = useState("")
  const [email, setEmail] = useState("")
  const [apiProducts, setApiProducts] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "error">("idle")

  const { siteData, loading } = useSiteData()

  // Config flags
  const showNewsletter = siteData?.configs?.collect_email === 1

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

  useEffect(() => {
    const fetchProducts = async () => {
      setIsSearching(true)
      try {
        const categoryId = selectedCategory === "all" ? undefined : selectedCategory
        const results = await siteServiceApi.searchProducts(searchTerm, categoryId, sortBy)
        setApiProducts(results.map(transformProduct))
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setIsSearching(false)
      }
    }

    const timer = setTimeout(() => {
      fetchProducts()
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, selectedCategory, sortBy])

  // Get newArrivals and bestSelling based on flags from API
  const newArrivals = useMemo(() => {
    return getNewArrivals(siteData)
  }, [siteData])

  const bestSelling = useMemo(() => {
    return getBestSelling(siteData)
  }, [siteData])

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      setSubscriptionStatus("idle")
      const result = await siteServiceApi.subscribeEmail(email)
      if (result.success) {
        setSubscriptionStatus("success")
        setEmail("")
      } else {
        setSubscriptionStatus("error")
      }
    } catch (error) {
      setSubscriptionStatus("error")
      console.error("Subscription error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Banner Skeleton */}
        <div className="block card w-full relative h-80 lg:h-100 bg-gradient-to-r from-slate-400 to-slate-500 overflow-hidden animate-pulse">
          <div className="absolute inset-0 bg-gray-300"></div>
          <div className="block main-hero px-4 h-80 lg:h-100 absolute inset-0 flex w-full">
            <div className="block w-full max-w-7xl mx-auto flex items-center">
              <div className="space-y-4 w-full max-w-2xl">
                <div className="h-12 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Lists Skeleton */}
        <div className="block block-new-arrival mt-20 px-4">
          <div className="block mx-auto w-full max-w-7xl">
            <div className="block-title">
              <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
            </div>
            <div className="block block-products mt-10">
              <div className="block grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="block rounded-lg text-base border border-gray-200 rounded-lg animate-pulse">
                    <div className="block block-image">
                      <div className="w-full aspect-square lg:aspect-auto lg:h-80 lg:w-80 bg-gray-300 rounded-t-lg"></div>
                    </div>
                    <div className="block p-4">
                      <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="block block-best-selling mt-20 px-4">
          <div className="block mx-auto w-full max-w-7xl">
            <div className="block-title">
              <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
            </div>
            <div className="block block-products mt-10">
              <div className="block grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="block rounded-lg text-base border border-gray-200 rounded-lg animate-pulse">
                    <div className="block block-image">
                      <div className="w-full aspect-square lg:aspect-auto lg:h-80 lg:w-80 bg-gray-300 rounded-t-lg"></div>
                    </div>
                    <div className="block p-4">
                      <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* All Products Section Skeleton */}
        <div className="block block-main-content mt-20 px-4">
          <div className="block mx-auto w-full max-w-7xl">
            <div className="block-title flex justify-between mx-auto items-center">
              <div className="h-8 bg-gray-300 rounded w-32 animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded w-48 animate-pulse"></div>
            </div>
            <div className="block block-filter mt-10">
              <div className="block grid grid-cols-12 gap-4">
                <div className="block col-span-12 lg:col-span-6">
                  <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="block col-span-12 lg:col-span-3">
                  <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="block col-span-12 lg:col-span-3">
                  <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="block block-all-products mt-10">
              <div className="block block-products">
                <div className="block grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="block rounded-lg text-base border border-gray-200 rounded-lg animate-pulse">
                      <div className="block block-image">
                        <div className="w-full aspect-square lg:aspect-auto lg:h-80 lg:w-80 bg-gray-300 rounded-t-lg"></div>
                      </div>
                      <div className="block p-4">
                        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section Skeleton */}
        {showNewsletter && (
          <div className="block block-sub-email mt-20 px-4 bg-slate-100 dark:bg-navy-800">
            <div className="block mx-auto max-w-screen-lg items-center text-center">
              <div className="block block-email-text max-w-2xl py-10 mx-auto">
                <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded w-96 mx-auto mb-8 animate-pulse"></div>
                <div className="block grid grid-cols-12 items-center justify-center gap-4">
                  <div className="block col-span-12 lg:col-span-7">
                    <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                  <div className="block col-span-12 lg:col-span-5">
                    <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <Banner />
      {newArrivals.length > 0 && <ProductList products={newArrivals} title={newArrivalsTitle} variant="new-arrival" />}
      {bestSelling.length > 0 && <ProductList products={bestSelling} title={bestSellingTitle} variant="best-selling" />}

      <div className="block block-main-content mt-20 px-4 pb-10">
        <div className="block mx-auto w-full max-w-7xl">
          <div className="block-title flex justify-between mx-auto items-center">
            <span className="text-2xl font-bold">{allProductsTitle}</span>
            <span className="text-xs+ text-slate-500 dark:text-navy-300">
              {isSearching ? (
                "Searching..."
              ) : (
                `Show ${apiProducts.length > 0 ? 1 : 0}-${apiProducts.length} of ${allProducts.length} products`
              )}
            </span>
          </div>
          <SearchAndFilters
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            onSortChange={setSortBy}
            categories={siteData?.categories || []}
          />
          <div className="block block-all-products mt-10">
            <div className="block block-products">
              <div className="block grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {apiProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      {showNewsletter && (
        <div className="block block-sub-email mt-20 px-4 bg-slate-100 dark:bg-navy-800">
          <div className="block mx-auto max-w-screen-lg items-center text-center">
            <div className="block block-email-text max-w-2xl py-10 mx-auto">
              <div className="block">
                <span className="text-3xl font-bold">{emailSubscriptionTitle}</span>
                <p className="block mt-2">
                  <span className="mx-auto text-base text-slate-500 dark:text-navy-300">{emailSubscriptionSubtitle}</span>
                </p>
                <div className="block mt-5">
                  {subscriptionStatus === "success" && (
                    <label className="block">
                      <label className="text-success">Subscribed!</label>
                    </label>
                  )}
                  {subscriptionStatus === "error" && (
                    <label className="block">
                      <label className="text-error">Something went wrong. Please try again.</label>
                    </label>
                  )}
                </div>
                <div className="block mt-5">
                  <form onSubmit={handleNewsletterSubmit} method="post">
                    <div className="block grid grid-cols-12 items-center justify-center gap-4">
                      <div className="block col-span-12 lg:col-span-7">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-input w-full rounded-lg border border-slate-300 dark:border-navy-450 px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-slate-500"
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                      <div className="block col-span-12 lg:col-span-5">
                        <button
                          type="submit"
                          className="btn space-x-2 w-full font-medium text-white"
                          style={{ backgroundColor: "#16a34a" }}
                        >
                          <span>Subscribe Now</span>
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 transition-colors duration-200"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10.4995 13.5001L20.9995 3.00005M10.6271 13.8281L13.2552 20.5861C13.4867 21.1815 13.6025 21.4791 13.7693 21.566C13.9139 21.6414 14.0862 21.6415 14.2308 21.5663C14.3977 21.4796 14.5139 21.1821 14.7461 20.587L21.3364 3.69925C21.5461 3.16207 21.6509 2.89348 21.5935 2.72185C21.5437 2.5728 21.4268 2.45583 21.2777 2.40604C21.1061 2.34871 20.8375 2.45352 20.3003 2.66315L3.41258 9.25349C2.8175 9.48572 2.51997 9.60183 2.43326 9.76873C2.35809 9.91342 2.35819 10.0857 2.43353 10.2303C2.52043 10.3971 2.81811 10.5128 3.41345 10.7444L10.1715 13.3725C10.2923 13.4195 10.3527 13.443 10.4036 13.4793C10.4487 13.5114 10.4881 13.5509 10.5203 13.596C10.5566 13.6468 10.5801 13.7073 10.6271 13.8281Z"
                              ></path>
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <FloatingShoppingBag show={true} /> */}
    </div>
  )
}
