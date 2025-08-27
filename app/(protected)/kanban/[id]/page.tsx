'use client'
import { Add, ArrowLeft, Dots, Mail, Phone, Streak } from '@/components/icons'
import { useRouter } from 'next/navigation'
import styles from './page.module.scss'
type Props = {}

const page = (props: Props) => {
  const router = useRouter()
  return (
    <div className={styles.main}>
      <div className={styles.top_row}>
        <div
          className={styles.btn_back}
          onClick={() => {
            router.back()
          }}
        >
          <ArrowLeft width={20} height={24} stroke='#194EFF' fill='none' />
          <p>Go back</p>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.user}>
            <div className={styles.avatar}></div>
            <div className={styles.userDetails}>
              <p className={styles.name}>Jcob Jons</p>
              <p className={styles.designation}>
                Software Developer at Ringover
              </p>
            </div>
          </div>
          <div className={styles.actions}>
            <div className={styles.icons}>
              <Mail
                width={24}
                height={24}
                fill='#194EFF'
                className={styles.actionIcons}
              />
              <p className={styles.actionTitle}>Email</p>
            </div>
            <div className={styles.icons}>
              <Phone
                width={24}
                height={24}
                fill='#194EFF'
                className={styles.actionIcons}
              />
              <p className={styles.actionTitle}>Phone</p>
            </div>
            <div className={styles.icons}>
              <Streak
                width={24}
                height={24}
                fill='#194EFF'
                className={styles.actionIcons}
              />
              <p className={styles.actionTitle}>Enrich</p>
            </div>
            <div className={styles.icons}>
              <Dots
                width={24}
                height={24}
                fill='#194EFF'
                className={styles.actionIcons}
              />
              <p className={styles.actionTitle}>More</p>
            </div>
          </div>
        </div>

        <div className={styles.tags}>
          <div className={styles.tag}>
            <p className={styles.tagTitle}>qualified</p>
          </div>
          <div className={styles.addTag}>
            <Add width={16} height={16} fill='#194EFF' />
            <p className={styles.add}>Add tag...</p>
          </div>
        </div>

        <div className={styles.cardDetails}>

            <div className={styles.details}>
                <div></div>
                <div></div>

            </div>

            <div className={styles.details}>

            </div>

            <div className={styles.details}>

            </div>

        </div>


      </div>
    </div>
  )
}

export default page
