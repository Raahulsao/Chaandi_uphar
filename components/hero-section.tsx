"use client"

import styles from "./hero-section.module.css"
import { useRef, useState, useEffect } from "react"

export function HeroSection() {
  const slides = [
    "/Untitled design (3) (1).png",
    "/Untitled design (2) (1).png",
    "/Untitled design (1).png",
    "/18-kt-jew-desktop.webp",
  ]
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(0)

  function handleScroll() {
    const el = scrollerRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    if (idx !== active) setActive(idx)
  }

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const onResize = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth)
      setActive(idx)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [active])

  return (
    <>
      <div className="h-0.5 bg-white"></div>

      <section className="relative overflow-hidden bg-white">
        <div className="relative container mx-auto px-4 py-0 bg-white">
          <div
            id="heroScroller"
            ref={scrollerRef}
            onScroll={handleScroll}
            className={`relative flex gap-0 overflow-x-auto overflow-y-hidden snap-x snap-mandatory rounded-2xl ${styles.noScrollbar} scroll-smooth bg-white`}
            role="region"
            aria-label="Hero gallery"
          >
            {slides.map((src, i) => (
              <img
                key={src}
                src={src || "/placeholder.svg"}
                alt={`Hero slide ${i + 1}`}
                className="snap-center shrink-0 min-w-full w-full aspect-video md:h-[480px] lg:h-[550px] object-cover rounded-2xl"
              />
            ))}
          </div>

          <div className="mt-3 flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => {
                  const el = scrollerRef.current
                  if (!el) return
                  el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" })
                }}
                className={`h-2 w-2 rounded-full transition-colors ${
                  active === i ? "bg-neutral-800" : "bg-neutral-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
