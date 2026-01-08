"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchAndFiltersProps {
  onSearchChange: (search: string) => void
  onCategoryChange: (category: string) => void
  onSortChange: (sort: string) => void
}

export default function SearchAndFilters({ onSearchChange, onCategoryChange, onSortChange }: SearchAndFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange(value)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search products..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
      <Select defaultValue="all" onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          <SelectItem value="flowering">Flowering plants</SelectItem>
          <SelectItem value="herbs">Herbs</SelectItem>
          <SelectItem value="succulents">Succulents</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="featured" onValueChange={onSortChange}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Order by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="featured">Featured</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="name">Name</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
