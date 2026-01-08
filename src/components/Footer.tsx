import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">🌿</span>
              </div>
              <span className="font-semibold text-lg">Store</span>
            </Link>
          </div>

          <div className="flex justify-center gap-6">
            <Link href="#" className="text-gray-400 hover:text-gray-600">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600">
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600">
              <Instagram className="h-5 w-5" />
            </Link>
          </div>

          <p className="text-gray-500 text-sm">© 2024 Store - All Rights Reserved</p>
        </div>
      </div>
    </footer>
  )
}
