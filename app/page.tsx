import Link from 'next/link'
import React from 'react'
import {getCurrentUser, isAuthenticated} from '@/lib/actions/auth.actions'
import { redirect } from 'next/navigation'

const HomePage = async () => {
  const session = await getCurrentUser();

  if (session) {
    redirect("/root")
  }
  return (
    <button>
        <Link href="/sign-in">Sign IN</Link>
    </button>
  )
}

export default HomePage