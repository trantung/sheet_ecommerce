"use client"

import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { useEffect, useState } from "react"
import { siteServiceApi, type SiteData } from "@/services/api/siteServiceApi"
import Image from "next/image"

export default function Footer() {
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
  const footerCopyright = getSiteInfo("footer_copyright") || "© 2024 Store - All Rights Reserved"
  const facebookUrl = getSiteInfo("facebook_url")
  const twitterUrl = getSiteInfo("twitter_url")
  const linkedinUrl = getSiteInfo("linkedin_url")
  const instagramUrl = getSiteInfo("instagram_url")

  if (loading) {
    return (
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="h-6 w-24 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-center gap-6">
              <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="h-4 w-48 bg-gray-300 rounded mx-auto animate-pulse"></div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
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
          </div>

          <div className="flex justify-center gap-6">
            {twitterUrl && (
              <Link href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                <Twitter className="h-5 w-5" />
              </Link>
            )}
            {linkedinUrl && (
              <Link href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                <Linkedin className="h-5 w-5" />
              </Link>
            )}
            {facebookUrl && (
              <Link href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                <Facebook className="h-5 w-5" />
              </Link>
            )}
            {instagramUrl && (
              <Link href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                <Instagram className="h-5 w-5" />
              </Link>
            )}
          </div>

          <p className="text-gray-500 text-sm">{footerCopyright}</p>
        </div>
      </div>
    </footer>
  )
}
