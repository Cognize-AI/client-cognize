import React from 'react'
import styles from './page.module.scss'
import Image from 'next/image'

type Props = {}

const page = (props: Props) => {
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
              <p className={styles.button_text}>Continue with google</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
