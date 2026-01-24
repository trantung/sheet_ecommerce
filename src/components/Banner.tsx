"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { siteServiceApi } from "@/services/api/siteServiceApi"
import { useSiteData } from "@/contexts/SiteDataContext"

export default function Banner() {
  const { siteData, loading } = useSiteData()

  const getSiteInfo = (code: string) => {
    return siteServiceApi.getSiteInfoByCode(siteData?.site_informations || [], code)
  }

  // Check if hero should be disabled (1 = disabled, 2 = enabled)
  const disableHero = siteData?.configs?.disable_hero === 1

  if (loading) {
    return (
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
    )
  }

  const backgroundHero = getSiteInfo("background_hero")
  const titlePage = getSiteInfo("title_page") || "Store Multi Purpose"
  const subtitlePage = getSiteInfo("subtitle_page") || "This is a demo of our multi purpose template."
  const primaryColor = getSiteInfo("primary_color") || "#16a34a"
  const textCenter = siteData?.configs?.text_center === 1
  const smallHero = siteData?.configs?.small_hero === 1
  const heroHeight = smallHero ? "h-80" : "h-80 lg:h-100"

  return (
    <div className="block card w-full relative">
      <div className="block relative h-80 lg:h-100">
        {backgroundHero ? (
          <img
            src={backgroundHero}
            alt="Hero background"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="h-80 lg:h-100 w-full bg-gradient-to-r from-slate-400 to-slate-500"></div>
        )}
      </div>
      
      <div className="absolute inset-0 bg-black opacity-20"></div>
      {!disableHero && (
        <div className={`block main-hero px-4 ${heroHeight} absolute inset-0 flex w-full`}>
          <div className={`block w-full max-w-7xl mx-auto flex items-center ${textCenter ? "justify-center text-center" : ""}`}>
            <div className="block max-w-2xl text-white">
              <h1 className="lg:text-5xl font-bold block text-2xl">{titlePage}</h1>
              <h2 className="text-lg block mt-4">{subtitlePage}</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
