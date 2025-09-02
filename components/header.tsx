"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Heart, ShoppingBag, Menu, User, MapPin, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [pincode, setPincode] = useState<string>("")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    try {
      const saved = window.localStorage.getItem("luxe_pincode")
      if (saved) setPincode(saved)
    } catch {}
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const categories = [
    { href: "/jewellery", label: "Jewellery", imgSrc: "/icons/necklace.png" },
    { href: "/silver", label: "Silver", imgSrc: "/icons/golden.png" },
    { href: "/chains", label: "Chains", imgSrc: "/icons/pendant-necklance.png" },
    { href: "/earrings", label: "Earrings", imgSrc: "/icons/earrings.png" },
    { href: "/rings", label: "Rings", imgSrc: "/icons/wedding-ring.png" },
    { href: "/bracelet", label: "Bracelet", imgSrc: "/icons/bracelet.png" },
    { href: "/couple-goals", label: "Couple Goals", imgSrc: "/icons/fashion.png" },
    { href: "/gifts", label: "Gift", imgSrc: "/icons/gift-card.png" },
  ]

  return (
    <>
      <header className="sticky top-0 w-full z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left Section - Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Chaandi Uphar logo" className="h-9 w-auto md:h-10 object-contain" />
              <span className="sr-only">Chaandi Uphar</span>
            </Link>

            {/* Center Section - Location & Search */}
            <div className="hidden lg:flex items-center space-x-6 flex-1 max-w-3xl mx-8">
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className="flex items-center space-x-2 text-base bg-gray-50 px-4 py-2.5 rounded-lg border hover:border-[#ff8fab] focus:outline-none focus:ring-2 focus:ring-[#ff8fab]/20"
                    aria-label="Set delivery pincode"
                  >
                    <MapPin className="w-5 h-5 text-[#ff8fab]" />
                    <span className="text-gray-900 font-medium">
                      {pincode ? `Deliver to ${pincode}` : "Where to Deliver?"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enter delivery pincode</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-3">
                    <Input
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="e.g. 560001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      aria-label="Pincode"
                    />
                    <p className="text-xs text-muted-foreground">
                      We’ll show delivery options and availability for your area.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button
                      className="bg-[#ff8fab] hover:bg-[#ff8fab]/90 text-white rounded-md"
                      onClick={() => {
                        try {
                          window.localStorage.setItem("luxe_pincode", pincode)
                        } catch {}
                        const closeBtn = document.querySelector(
                          "[data-slot='dialog-close']",
                        ) as HTMLButtonElement | null
                        closeBtn?.click()
                      }}
                      disabled={pincode.length < 4}
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  placeholder='Search "Diamond Rings"'
                  className="pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#ff8fab] focus:ring-2 focus:ring-[#ff8fab]/20 text-base w-full"
                />
                <Button
                  size="icon"
                  aria-label="Search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#ff8fab] hover:bg-[#ff8fab]/90 text-white rounded-md"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Right Section - Icons */}
            <div className="flex items-center space-x-4 lg:space-x-6 w-60 mx-5 px-0 py-0 my-0 mr-3.5 ml-5 mb-[-10px]">
              <Link href="/stores" className="hidden lg:flex flex-col items-center text-xs group"></Link>

              <Link href="/profile" className="hidden md:flex flex-col items-center text-xs group">
                <User className="w-5 h-5 mb-1 text-gray-700 group-hover:text-[#ff8fab] transition-colors" />
                <span className="text-gray-900 font-medium text-[10px] group-hover:text-[#ff8fab] transition-colors">
                  ACCOUNT
                </span>
              </Link>

              <Link href="/wishlist" className="flex flex-col items-center text-xs group">
                <div className="relative">
                  <Heart className="w-5 h-5 mb-1 text-gray-700 group-hover:text-[#ff8fab] transition-colors" />
                  <span className="absolute -top-1 -right-1 bg-[#ff8fab] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                    2
                  </span>
                </div>
                <span className="text-gray-900 font-medium text-[10px] group-hover:text-[#ff8fab] transition-colors">
                  WISHLIST
                </span>
              </Link>

              <Link href="/cart" className="flex flex-col items-center text-xs group">
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 mb-1 text-gray-700 group-hover:text-[#ff8fab] transition-colors" />
                  <span className="absolute -top-1 -right-1 bg-[#ff8fab] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                    3
                  </span>
                </div>
                <span className="text-gray-900 font-medium text-[10px] group-hover:text-[#ff8fab] transition-colors">
                  CART
                </span>
              </Link>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col space-y-4 mt-8">
                    <Link href="/collections" className="text-lg font-medium hover:text-[#ff8fab]">
                      Collections
                    </Link>
                    <Link href="/new-arrivals" className="text-lg font-medium hover:text-[#ff8fab]">
                      New Arrivals
                    </Link>
                    <Link href="/gifting" className="text-lg font-medium hover:text-[#ff8fab]">
                      Gifting
                    </Link>
                    <Link href="/about" className="text-lg font-medium hover:text-[#ff8fab]">
                      About
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Category Bar */}
          <div className="w-full">
            <div className="flex items-center justify-center py-1 overflow-x-auto md:overflow-visible mx-0 my-0 lg:gap-10">
              {categories.map(({ href, label, imgSrc }) => (
                <Link
                  key={href}
                  href={href}
                  className="whitespace-nowrap flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#ff8fab] transition-colors"
                  aria-label={label}
                >
                  <img
                    src={imgSrc || "/placeholder.svg"}
                    alt={`${label} icon`}
                    className="w-5 h-5 object-contain opacity-80"
                  />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
