"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Heart, ShoppingBag, Menu, User, MapPin, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [pincode, setPincode] = useState<string>("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const router = useRouter()

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
    { href: "/pendants", label: "Pendants", imgSrc: "/icons/pendant.png" },
    { href: "/earrings", label: "Earrings", imgSrc: "/icons/earrings.png" },
    { href: "/rings", label: "Rings", imgSrc: "/icons/wedding-ring.png" },
    { href: "/bracelet", label: "Bracelet", imgSrc: "/icons/bracelet.png" },
    { href: "/couple-goals", label: "Couple Goals", imgSrc: "/icons/fashion.png" },
    { href: "/gifts", label: "Gift", imgSrc: "/icons/gift-card.png" },
  ]

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-14 md:h-16 lg:hidden">
            {/* Mobile Menu */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col items-center">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <nav className="flex flex-col space-y-4 mt-8 w-full px-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="flex items-center gap-2 text-lg font-medium hover:text-[#ff8fab] cursor-pointer">
                            <MapPin className="w-6 h-6 text-[#ff8fab]" />
                            <span>Where to Deliver?</span>
                          </div>
                        </DialogTrigger>
                        <DialogContent aria-labelledby="pincode-dialog-title-mobile">
                            <DialogHeader>
                              <DialogTitle id="pincode-dialog-title-mobile">Enter delivery pincode</DialogTitle>
                              <DialogDescription className="sr-only">Enter your pincode to see delivery options</DialogDescription>
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
                      {categories.map(({ href, label, imgSrc }) => (
                        <div key={href} className="w-full">
                          <Link
                            href={href}
                            className="flex items-center gap-2 text-lg font-medium hover:text-[#ff8fab]"
                            onClick={() => setIsSheetOpen(false)}
                          >
                            <img
                              src={imgSrc || "/placeholder.svg"}
                              alt={`${label} icon`}
                              className="w-6 h-6 object-contain opacity-80"
                            />
                            <span>{label}</span>
                          </Link>
                          <div className="border-b border-gray-200 my-2"></div>
                        </div>


                      ))}
                    </nav>
                  </SheetContent>
                </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Chaandi Uphar logo" className="h-8 w-auto object-contain" />
              <span className="sr-only">Chaandi Uphar</span>
            </Link>

            {/* Right Section - Icons */}
            <div className="flex items-center gap-1">
              <Link href="/auth/login" className="text-black p-2 hover:bg-gray-100 rounded-md">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
              <Link href="/wishlist" className="text-black p-2 hover:bg-gray-100 rounded-md">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Link>
              <Link href="/cart" className="text-black p-2 hover:bg-gray-100 rounded-md">
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="pb-1 lg:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                placeholder='Search "Diamond Rings"'
                className="w-full pl-10 pr-12 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8fab]/20 text-base"
              />
              <Button className="bg-[#ff8fab] text-white rounded-r-lg w-10 h-9 flex items-center justify-center absolute right-0 top-1/2 transform -translate-y-1/2">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between h-20">
                {/* Left Section - Logo */}
                <Link href="/" className="flex items-center space-x-2">
                  <img src="/logo.png" alt="Chaandi Uphar logo" className="h-9 w-auto md:h-10 object-contain" />
                  <span className="sr-only">Chaandi Uphar</span>
                </Link>

                {/* Center Section - Location & Search */}
                <div className="flex items-center space-x-6 flex-1 max-w-3xl mx-8">
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
                    <DialogContent aria-labelledby="pincode-dialog-title-desktop">
                      <DialogHeader>
                        <DialogTitle id="pincode-dialog-title-desktop">Enter delivery pincode</DialogTitle>
                        <DialogDescription className="sr-only">Enter your pincode to see delivery options</DialogDescription>
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
                   className="w-full pl-12 pr-12 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff8fab]/20 text-base"
                 />
                    <Button className="bg-[#ff8fab] text-white rounded-r-lg w-8.8 h-9 flex items-center justify-center absolute right-0 top-1/2 transform -translate-y-1/2">
                   <Search className="h-5 w-5" />
                 </Button>
                  </div>
                </div>

                {/* Right Section - Icons (Desktop) */}
                <div className="flex items-center space-x-4 lg:space-x-6">
                  <Link href="/stores" className="hidden lg:flex flex-col items-center text-xs group"></Link>

                  <Link href="/auth/login" className="flex flex-col items-center text-xs group">
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
                </div>
              </div>

          {/* Category Bar */}
          <div className="w-full hidden lg:block">
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
