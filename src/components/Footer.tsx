"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { siteServiceApi } from "@/services/api/siteServiceApi"
import { useSiteData } from "@/contexts/SiteDataContext"
import Image from "next/image"

export default function Footer() {
  const { siteData, loading } = useSiteData()

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
  const primaryColor = getSiteInfo("primary_color") || "#16a34a"

  if (loading) {
    return (
      <div className="block block-footer px-4 bg-slate-100 dark:bg-navy-800">
        <div className="block max-w-screen-lg mx-auto items-center py-10">
          <div className="block flex flex-col items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="h-4 w-48 bg-gray-300 rounded mx-auto mt-5 animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="block block-footer px-4 bg-slate-100 dark:bg-navy-800">
      <div className="block max-w-screen-lg mx-auto items-center py-10">
        <div className="block flex flex-col items-center">
          <div className="block logo-section">
            <Link href="/" className="router-link-active router-link-exact-active flex items-center space-x-2">
              <div className="avatar h-8 w-8">
                {siteLogo ? (
                  <Image
                    src={siteLogo}
                    alt={siteName}
                    width={32}
                    height={32}
                    className="mask object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.setAttribute("data-error", "1")
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mask">
                    <span className="text-white font-bold text-xs">🌿</span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-xl line-clamp-1" style={{ color: primaryColor }}>
                  {siteName}
                </p>
              </div>
            </Link>
          </div>
          <div className="block footer-social-links mt-5">
            <ul className="flex flex-wrap items-center justify-center gap-6 text-slate-600 dark:text-navy-300">
              {twitterUrl && (
                <li>
                  <Link href={twitterUrl} target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3"></path>
                    </svg>
                  </Link>
                </li>
              )}
              {linkedinUrl && (
                <li>
                  <Link href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </Link>
                </li>
              )}
              {facebookUrl && (
                <li>
                  <Link href={facebookUrl} target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </Link>
                </li>
              )}
              {instagramUrl && (
                <li>
                  <Link href={instagramUrl} target="_blank" rel="noopener noreferrer">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div className="block flex flex-wrap items-center justify-center mt-5">
            <span className="text-xs+ text-slate-500 dark:text-navy-300">{footerCopyright}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
