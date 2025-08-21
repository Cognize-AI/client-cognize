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
            src={card.image_url}
            alt='Avatar'
            width={24}
            height={24}
          />
        </div>
        <div className={styles.userDetails}>
          <p className={styles.userName}>{card.name || 'Unknown'}</p>
          <p className={styles.userTitle}>{card.designation || '-'}</p>
        </div>
        <div>
          <Image src='/images/dots.png' alt='Edit' width={16} height={16} />
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.userEmail}>
          <Image src='/images/email.png' alt='Email' width={16} height={16} />

          <p className={styles.email}>{card.email || '-'}</p>
        </div>
        <div className={styles.userContact}>
          <Image src='/images/phone.png' alt='Phone' width={16} height={16} />

          <p className={styles.contact}>{card.phone || '-'}</p>
        </div>
      </div>
      <div className={styles.userTags}>
        <div className={styles.userTag}>
          <div className={styles.addTag}>UI desginer</div>
          <div className={styles.addTag}>
            <Image src='/images/add.png' alt='Tag' width={16} height={16} />
            Add tag
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
