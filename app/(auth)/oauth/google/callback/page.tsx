'use client'
import { axios_instance } from '@/lib/axios'
import styles from './page.module.scss'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

const Page = () => {
  const hasVerified = useRef(false)

  useEffect(() => {
    const verifyGoogleSignIn = async () => {
      const code = new URLSearchParams(window.location.search).get('code')
      if (!code) return

      try {
        const response = await axios_instance.get(`/oauth/google/callback?code=${code}`)
        const token = response.data?.data?.token
        const redirectUrl = response.data?.data?.redirect_url

        if (token) localStorage.setItem('token', token)
        window.location.href = redirectUrl ?? '/kanban'
      } catch (error) {
        console.error('Error verifying Google sign-in:', error)
        window.location.href = '/signin?error=auth_failed'
      }
    }

    if (!hasVerified.current) {
      hasVerified.current = true
      verifyGoogleSignIn()
    }
  }, [])

  return (
    <div className={styles.main_container}>
      <Image src='/images/login_card.png' alt='Login' width={400} height={300} priority />
      <p>Redirecting...</p>
    </div>
  )
}

export default Page
