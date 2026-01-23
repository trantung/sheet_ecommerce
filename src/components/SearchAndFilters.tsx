"use client"

import { useState } from "react"

interface Category {
  category_id: number
  category_name: string
}

interface SearchAndFiltersProps {
  onSearchChange: (search: string) => void
  onCategoryChange: (category: string) => void
  onSortChange: (sort: string) => void
  categories?: Category[]
}

export default function SearchAndFilters({ onSearchChange, onCategoryChange, onSortChange, categories = [] }: SearchAndFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange(value)
  }

  const handleSortChange = (value: string) => {
    // Map template sort values to component values
    if (value === "price") {
      onSortChange("price-low")
    } else if (value === "-price") {
      onSortChange("price-high")
    } else if (value === "name") {
      onSortChange("name")
    } else if (value === "-name") {
      onSortChange("name")
    } else {
      onSortChange("featured")
    }
  }

  return (
    <div className="block block-filter mt-10">
      <div className="block grid grid-cols-12 gap-4">
        <div className="block col-span-12 lg:col-span-6">
          <div className="relative flex">
            <input
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="form-input peer w-full rounded-lg border border-slate-300 dark:border-navy-450 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-slate-500"
              placeholder="Search here..."
              type="text"
            />
            <div className="cursor-pointer hover:text-slate-800 absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:border-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="block col-span-12 lg:col-span-3">
          <div className="block">
            <select
              className="form-select w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-slate-500 dark:border-navy-450 dark:bg-navy-900 dark:hover:border-navy-400"
              defaultValue="all"
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_name}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="block col-span-12 lg:col-span-3">
          <div className="block">
            <select
              className="form-select w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-slate-500 dark:border-navy-450 dark:bg-navy-900 dark:hover:border-navy-400"
              defaultValue=""
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="">Order by</option>
              <option value="price">⬇️ Price</option>
              <option value="-price">⬆️ Price</option>
              <option value="name">⬇️ Name A-Z</option>
              <option value="-name">⬆️ Name Z-A</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
