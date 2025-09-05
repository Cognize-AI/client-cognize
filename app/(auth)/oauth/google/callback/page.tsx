'use client'
import { axios_instance } from '@/lib/axios'
import styles from './page.module.scss'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useUserStore } from '@/provider/user-store-provider'

const Page = () => {
  const hasVerified = useRef(false)

  const setUserToken = useUserStore(state => state.setUserToken)

  useEffect(() => {
    const verifyGoogleSignIn = async () => {
      const code = new URLSearchParams(window.location.search).get('code')
      if (!code) return

      try {
        const response = await axios_instance.get(`/oauth/google/callback?code=${code}`)
        // const token = response.data?.data?.token
        const redirectUrl = response.data?.data?.redirect_url

        // if (token) localStorage.setItem('token', token)
        setUserToken(response?.data?.data)
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
      <div className={styles.container}>
        <div className={styles.content}>
          <Image
            src='/images/login_card.png'
            alt=''
            width={394}
            height={226}
            className={styles.image}
            quality={100}
          />
          <div className={styles.title}>
            <p className={styles.heading}>Manage your contacts with ease.</p>
            <p className={styles.subheading}>
              Sign in to organize, tag, and track your leads, all in one place.
            </p>
          </div>
          <div className={styles.actions}>
            <div
              className={styles.button_container}
            >
              <Image
                src='/images/Google.svg'
                alt='Google Logo'
                width={24}
                height={24}
                className={styles.button_icon}
              />
              <p className={styles.button_text}>Redirecting...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
