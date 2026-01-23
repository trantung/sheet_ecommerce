"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { siteServiceApi, type SiteData } from "@/services/api/siteServiceApi"

export default function Banner() {
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

  // Check if hero should be disabled (1 = disabled, 2 = enabled)
  const disableHero = siteData?.configs?.disable_hero === 1

  if (loading) {
    return (
      <section className="relative h-96 bg-gradient-to-r from-slate-400 to-slate-500 overflow-hidden animate-pulse">
        <div className="absolute inset-0 bg-gray-300"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="space-y-4 w-full max-w-2xl">
            <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  if (disableHero) {
    return null
  }

  const backgroundHero = getSiteInfo("background_hero")
  const titlePage = getSiteInfo("title_page") || "Store Multi Purpose"
  const subtitlePage = getSiteInfo("subtitle_page") || "This is a demo of our multi purpose template."
  const primaryColor = getSiteInfo("primary_color") || "#16a34a"
  const smallHero = siteData?.configs?.small_hero === 1

  // const heroHeight = smallHero ? "h-64" : "h-96"
  const heroHeight = "h-96"

  return (
    <section className={`relative ${heroHeight} bg-gradient-to-r from-slate-400 to-slate-500 overflow-hidden`}>
      {backgroundHero && (
        <div className="absolute inset-0">
          <Image
            src={backgroundHero}
            alt="Hero background"
            fill
            className="object-cover opacity-80"
            priority
          />
        </div>
      )}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center">
        <div className="text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{titlePage}</h1>
          <p className="text-lg opacity-90">{subtitlePage}</p>
        </div>
      </div>
    </section>
  )
}
