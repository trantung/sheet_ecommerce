"use client"

import type React from "react"

import { useState, useMemo } from "react"
import Banner from "@/components/Banner"
import ProductList from "@/components/ProductList"
import SearchAndFilters from "@/components/SearchAndFilters"
import ProductCard from "@/components/ProductCard"
import FloatingShoppingBag from "@/components/FloatingShoppingBag"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const newArrivals = [
  {
    id: "1",
    name: "Lavender",
    price: 50.0,
    originalPrice: 60.0,
    image: "/placeholder.svg?height=300&width=300",
    slug: "lavender",
  },
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

const bestSelling = [
  {
    id: "5",
    name: "Rose",
    price: 70.0,
    originalPrice: 90.0,
    image: "/placeholder.svg?height=300&width=300",
    slug: "rose",
  },
  {
    id: "6",
    name: "Money plant",
    price: 75.0,
    originalPrice: 95.0,
    image: "/placeholder.svg?height=300&width=300",
    slug: "money-plant",
  },
  {
    id: "7",
    name: "Aloe vera",
    price: 80.0,
    originalPrice: 100.0,
    image: "/placeholder.svg?height=300&width=300",
    slug: "aloe-vera",
  },
  {
    id: "8",
    name: "Bamboo",
    price: 85.0,
    originalPrice: 105.0,
    image: "/placeholder.svg?height=300&width=300",
    slug: "bamboo",
  },
]

const allProducts = [
  ...newArrivals,
  ...bestSelling,
  {
    id: "9",
    name: "Hostas",
    price: 95.0,
    originalPrice: 120.0,
    image: "/placeholder.svg?height=300&width=300",
    slug: "hostas",
  },
  {
    id: "10",
    name: "Fern",
    price: 40.0,
    originalPrice: 55.0,
    image: "/placeholder.svg?height=300&width=300",
    slug: "fern",
  },
]

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [email, setEmail] = useState("")

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filter by category
    if (selectedCategory !== "all") {
      const categoryMap: { [key: string]: string[] } = {
        flowering: ["Lavender", "Marigold", "Tulip", "Lily", "Rose"],
        herbs: ["Lavender"],
        succulents: ["Aloe vera"],
      }
      filtered = filtered.filter((product) => categoryMap[selectedCategory]?.includes(product.name))
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
  }, [searchTerm, selectedCategory, sortBy])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Thank you for subscribing with email: ${email}`)
    setEmail("")
  }

  return (
    <div>
      <Banner />
      <ProductList products={newArrivals} title="New Arrivals" />
      <ProductList products={bestSelling} title="Best Selling Products" />

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">All Products</h2>
            <span className="text-gray-600">
              Showing {filteredProducts.length} of {allProducts.length} products
            </span>
          </div>
          <SearchAndFilters
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            onSortChange={setSortBy}
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
          <h2 className="text-3xl font-bold mb-4">Join Our Email List</h2>
          <p className="text-gray-600 mb-8">Sign up to receive the latest products directly in your inbox</p>
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
