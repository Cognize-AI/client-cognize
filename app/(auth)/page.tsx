'use client'
import { axios_instance } from '@/lib/axios'
import styles from './page.module.scss' 
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type Props = {}

const Page = (props: Props) => {
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    try {
      const response = await axios_instance.get('/oauth/google/redirect-uri')
      if (response.data?.data?.redirect_url) {
        window.location.href = response.data.data.redirect_url
      }
    } catch (error) {
      console.error("Failed to get Google sign-in URL", error)
    }
  }

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
              onClick={handleGoogleSignIn}
            >
              <Image
                src='/images/Google.svg'
                alt='Google Logo'
                width={24}
                height={24}
                className={styles.button_icon}
              />
              <p className={styles.button_text}>Continue with Google</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page