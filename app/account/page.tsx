export default function AccountPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <section className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <div className="col-span-1 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">My Profile</h2>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-gray-100" />
            <div>
              <p className="font-medium">Guest User</p>
              <p className="text-sm text-muted-foreground">Sign in to sync your orders and wishlist</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <a href="/account" className="rounded-lg border p-3 text-center hover:shadow-sm transition">
              <p className="text-sm text-muted-foreground">Orders</p>
              <p className="font-semibold">0</p>
            </a>
            <a href="/wishlist" className="rounded-lg border p-3 text-center hover:shadow-sm transition">
              <p className="text-sm text-muted-foreground">Wishlist</p>
              <p className="font-semibold">3</p>
            </a>
            <a href="/account" className="rounded-lg border p-3 text-center hover:shadow-sm transition">
              <p className="text-sm text-muted-foreground">Coupons</p>
              <p className="font-semibold">—</p>
            </a>
            <a href="/account" className="rounded-lg border p-3 text-center hover:shadow-sm transition">
              <p className="text-sm text-muted-foreground">Addresses</p>
              <p className="font-semibold">—</p>
            </a>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-2 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap items-center gap-3">
            <a href="/rings" className="rounded-full border px-4 py-2 hover:bg-gray-50 transition">
              Shop Rings
            </a>
            <a href="/bracelet" className="rounded-full border px-4 py-2 hover:bg-gray-50 transition">
              Shop Bracelets
            </a>
            <a href="/earrings" className="rounded-full border px-4 py-2 hover:bg-gray-50 transition">
              Shop Earrings
            </a>
            <a href="/gifts" className="rounded-full border px-4 py-2 hover:bg-gray-50 transition">
              Gift Items
            </a>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">Recent Orders</h3>
            <div className="rounded-lg border p-4 text-sm text-muted-foreground">
              You have no recent orders. Start exploring our latest collections.
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
