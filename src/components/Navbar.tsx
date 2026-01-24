"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { siteServiceApi } from "@/services/api/siteServiceApi"
import { useSiteData } from "@/contexts/SiteDataContext"
import Image from "next/image"

export default function Navbar() {
  const { siteData, loading } = useSiteData()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const getSiteInfo = (code: string) => {
    return siteServiceApi.getSiteInfoByCode(siteData?.site_informations || [], code)
  }

  const siteName = getSiteInfo("site_name") || "Store"
  const siteLogo = getSiteInfo("site_logo")
  const primaryColor = getSiteInfo("primary_color") || "#16a34a"
  const headerLinkText = getSiteInfo("header_link_text")
  const headerLink = getSiteInfo("header_link")

  // Check if about-us page exists in dynamic pages
  const hasAboutUsPage = siteData?.header?.pages?.some(page => page.page_address === "about-us")
  const aboutUsRoute = hasAboutUsPage ? "/about-us" : "/"

  if (loading) {
    return (
      <div className="block block-header dark:border-navy-500 py-3 px-4">
        <div className="block mx-auto">
          <div className="block w-full">
            <div className="flex justify-between items-center">
              <div className="block block-logo">
                <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
              </div>
              <div className="h-10 w-24 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="block block-header dark:border-navy-500 py-3 px-4">
        <div className="block mx-auto">
          <div className="block w-full">
            <div className="flex justify-between items-center">
              <div className="block block-logo">
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
              </div>
              <div className="block block-menu">
                <div className="space-x-4 hidden lg:flex justify-between items-center">
                  {/* <button className="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 dark:hover:bg-navy-300/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"></path>
                    </svg>
                  </button> */}

                  {/* Dynamic Pages */}
                  {/* {siteData?.header?.pages
                    ?.filter((page) => page.menu_title && page.show_in_header == 1)
                    .map((page, index) => (
                      <Link
                        key={`page-${index}`}
                        href={`/pages/${page.page_address}`}
                        target={page.target === 2 ? "_blank" : "_self"}
                        className="navbar-page"
                      >
                        {page.menu_title}
                      </Link>
                    ))} */}

                  {/* Dynamic Nav Bars */}
                  {siteData?.header?.nar_bars?.map((item, index) => (
                    <Link
                      key={`nav-${index}`}
                      href={item.link || "#"}
                      target={item.target === 1 ? "_blank" : "_self"}
                      rel={item.target === 1 ? "noopener noreferrer" : undefined}
                      className="navbar-item"
                    >
                      {item.title}
                    </Link>
                  ))}

                  {/* About Us */}
                  <Link href={aboutUsRoute} className="btn hover:bg-slate-300/20 border border-slate-200 dark:border-navy-450">
                    About us
                  </Link>

                  {/* Header Link CTA */}
                  {headerLink && headerLinkText && (
                    <Link
                      href={headerLink}
                      className="btn text-white px-4 py-2 rounded-lg"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {headerLinkText} →
                    </Link>
                  )}
                </div>
                <div className="block flex items-center lg:hidden space-x-2">
                  <button className="btn h-8 w-8 rounded-full p-0 hover:bg-slate-300/20 dark:hover:bg-navy-300/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => setDrawerOpen(!drawerOpen)}
                    className="btn border border-slate-300 p-2 font-medium text-slate-800 hover:bg-slate-150 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500"
                  >
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="drawer">
        <div
          className={`drawer-overlay fixed inset-0 z-[100] bg-slate-900/60 ${drawerOpen ? "" : "hidden"}`}
          onClick={() => setDrawerOpen(false)}
        ></div>
        <div className={`drawer-content fixed left-0 top-0 z-[101] h-full w-72 ${drawerOpen ? "" : "hidden"}`}>
          <div className="flex h-full w-full transform-gpu flex-col bg-white transition-transform duration-200 dark:bg-navy-700">
            <div className="border-b border-slate-200 p-4 dark:border-navy-500 sm:px-5">
              <span className="font-medium flex justify-between items-center tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100 lg:text-base">
                <span className="block block-logo">
                  <div className="block logo-section">
                    <Link href="/" className="router-link-active router-link-exact-active flex items-center space-x-2">
                      <div className="avatar h-8 w-8">
                        {siteLogo ? (
                          <Image
                            src={siteLogo}
                            alt={siteName}
                            width={32}
                            height={32}
                            className="mask rounded-full object-cover"
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
                </span>
                <span className="cursor-pointer" onClick={() => setDrawerOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12"></path>
                  </svg>
                </span>
              </span>
            </div>
            <ul className="grow space-y-1.5 p-5 font-inter font-medium">
              <li>
                <Link
                  href="/"
                  onClick={() => setDrawerOpen(false)}
                  className="flex rounded-lg bg-slate-150 px-4 py-2.5 tracking-wide text-slate-800 outline-none transition-all dark:bg-navy-500 dark:text-navy-50"
                >
                  <span>Home</span>
                </Link>
              </li>

              {/* Dynamic Pages Mobile */}
              {siteData?.header?.pages
                ?.filter((page) => page.menu_title && page.show_in_header == 1)
                .map((page, index) => (
                  <li key={`mob-page-${index}`}>
                    <Link
                      href={`/pages/${page.page_address}`}
                      target={page.target === 2 ? "_blank" : "_self"}
                      onClick={() => setDrawerOpen(false)}
                      className="group flex space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                    >
                      <span>{page.menu_title}</span>
                    </Link>
                  </li>
                ))}

              {/* Dynamic Nav Bars Mobile */}
              {siteData?.header?.nar_bars?.map((item, index) => (
                <li key={`mob-nav-${index}`}>
                  <Link
                    href={item.link || "#"}
                    target={item.target === 1 ? "_blank" : "_self"}
                    onClick={() => setDrawerOpen(false)}
                    className="group flex space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                  >
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}

              {/* About Us Mobile */}
              <li>
                <Link
                  href={aboutUsRoute}
                  onClick={() => setDrawerOpen(false)}
                  className="group flex space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                >
                  <span>About us</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
