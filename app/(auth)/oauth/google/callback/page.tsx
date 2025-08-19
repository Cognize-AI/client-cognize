'use client'
import { axios_instance } from '@/lib/axios'
import styles from './page.module.scss'
import Image from 'next/image'
import { useEffect } from 'react'

type Props = {}

const Page = (props: Props) => {
  const verifyGoogleSignIn = async () => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (code) {
      try {
        const response = await axios_instance.get(
          `/oauth/google/callback?code=${code}`
        )
        console.log('Google Sign-In response:', response)
        if (response.data?.data?.redirect_url) {
          window.location.href = response.data.data.redirect_url
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
  useEffect(() => {
    verifyGoogleSignIn()
  }, [])

  return (
    <div className={styles.main_container}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Image
            src='/images/login_card.png'
            alt=''
            width={394}
            height={256}
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
            <div className={styles.button_container}>
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
