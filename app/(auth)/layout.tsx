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
    if (token) {
      router.push('/kanban')
    }
  }, [token, router])

  if (token) {
    return null
  }

  return <>{children}</>
}

export default Layout
