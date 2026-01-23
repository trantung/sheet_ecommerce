"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { siteServiceApi, type SiteData } from "@/services/api/siteServiceApi"
import Image from "next/image"

export default function Navbar() {
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

  const siteName = getSiteInfo("site_name") || "Store"
  const siteLogo = getSiteInfo("site_logo")

  if (loading) {
    return (
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="h-6 w-24 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-24 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {siteLogo ? (
            <Image
              src={siteLogo}
              alt={siteName}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">🌿</span>
            </div>
          )}
          <span className="font-semibold text-lg">{siteName}</span>
        </Link>

        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/about">About us</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
