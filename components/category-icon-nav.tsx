import Link from "next/link"

type Item = {
  label: string
  href: string
  imgSrc: string
}

const items: Item[] = [
  { label: "Jewellery", href: "/jewellery", imgSrc: "/icons/necklace.png" },
  { label: "Silver", href: "/silver", imgSrc: "/icons/golden.png" },
  { label: "Chains", href: "/chains", imgSrc: "/icons/pendant-necklance.png" },
  { label: "Pendants", href: "/pendants", imgSrc: "/icons/pendant-necklance.png" },
  { label: "Earrings", href: "/earrings", imgSrc: "/icons/earrings.png" },
  { label: "Rings", href: "/rings", imgSrc: "/icons/wedding-ring.png" },
  { label: "Bracelet", href: "/bracelet", imgSrc: "/icons/bracelet.png" },
  { label: "Couple Goals", href: "/couple-goals", imgSrc: "/icons/fashion.png" },
  { label: "Gift", href: "/gift", imgSrc: "/icons/gift-card.png" },
]

export function CategoryIconNav() {
  return (
    <nav aria-label="Shop categories" className="bg-white">
      <div className="container mx-auto">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-1">
          {items.map(({ label, href, imgSrc }) => (
            <li key={label}>
              <Link
                href={href}
                className="group inline-flex items-center gap-2 text-sm text-gray-700 hover:text-[#ff8fab] transition-colors"
                aria-label={label}
              >
                <img
                  src={imgSrc || "/placeholder.svg"}
                  alt={`${label} icon`}
                  className="h-5 w-5 object-contain opacity-80 group-hover:opacity-100"
                />
                <span className="whitespace-nowrap">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
