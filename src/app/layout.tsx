"use client"

import type React from "react"
import { useEffect } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import BackToTop from "@/components/BackToTop"
import { CartProvider } from "@/contexts/CartContext"
import { SiteDataProvider, useSiteData } from "@/contexts/SiteDataContext"
import { siteServiceApi } from "@/services/api/siteServiceApi"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

function SiteWrapper({ children }: { children: React.ReactNode }) {
  const { siteData, loading } = useSiteData()

  const getSiteInfo = (code: string) => {
    return siteServiceApi.getSiteInfoByCode(siteData?.site_informations || [], code)
  }

  const titlePage = getSiteInfo("title_page") || "Store"
  const subtitlePage = getSiteInfo("subtitle_page")

  useEffect(() => {
    if (titlePage) {
      document.title = subtitlePage ? `${titlePage} | ${subtitlePage}` : titlePage
    }
  }, [titlePage, subtitlePage])

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <BackToTop />
      </>
    )
  }

  const isPublished = siteData?.configs?.published === 1
  const hideHeader = siteData?.configs?.hide_header === 2
  const hideFooter = siteData?.configs?.hide_footer === 2

  if (!isPublished) {
    return (
      <div className="flex min-h-[100vh] w-full flex-col items-center p-6 text-center justify-center">
        <div className="w-full max-w-xs flex flex-col items-center text-center justify-center text-slate-800 dark:text-navy-50">
          <span className="font-semibold text-8xl dark:text-white">404</span>
        </div>
        <p className="pt-4 text-xl font-semibold text-slate-800 dark:text-navy-50"> Not Found. That page doesn’t exist. </p>
        <p className="pt-2 text-slate-500 dark:text-navy-200"> This page you are looking not available. Please back to home </p>
        <Link href="/" className="btn space-x-2 mt-8 bg-slate-150 font-medium text-slate-800 hover:bg-slate-200 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 px-4 py-2 rounded-lg">
          <span>Back To Home</span>
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"></path>
            </svg>
          </span>
        </Link>
      </div>
    )
  }

  return (
    <>
      {!hideHeader && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!hideFooter && <Footer />}
      <BackToTop />
    </>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SiteDataProvider>
          <CartProvider>
            <SiteWrapper>{children}</SiteWrapper>
          </CartProvider>
        </SiteDataProvider>
      </body>
    </html>
  )
}
