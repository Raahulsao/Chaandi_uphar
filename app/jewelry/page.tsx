import { redirect } from 'next/navigation'

export default function Page() {
  // Redirect American spelling to British spelling to maintain consistency
  redirect('/jewellery')
}