'use client'
import Image from 'next/image'
import styles from './card.module.scss'
import { CardType } from '../kanban/page'

type Props = { card: CardType }

const Card = ({ card }: Props) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          <Image
            src={card.image_url || '/images/default.png'}
            alt='Avatar'
            width={24}
            height={24}
          />
        </div>
        <div className={styles.userDetails}>
          <p className={styles.userName}>{card.name || 'Unknown'}</p>
          <p className={styles.userTitle}>{card.designation || '-'}</p>
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.userEmail}>
          <p className={styles.email}>{card.email || '-'}</p>
        </div>
        <div className={styles.userContact}>
          <p className={styles.contact}>{card.phone || '-'}</p>
        </div>
      </div>
    </div>
  )
}

export default Card