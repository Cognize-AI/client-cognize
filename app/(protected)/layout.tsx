'use client'

import { useUserStore } from '@/provider/user-store-provider'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  const token = useUserStore(state => state.token)
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.push('/') // ✅ safe client-side redirect
    }
  }, [token, router])

  if (!token) {
    return null // or a loading spinner
  }

  return <>{children}</>
}

export default Layout
