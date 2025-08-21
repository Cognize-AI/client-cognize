'use client';
import Image from 'next/image';
import styles from './Card.module.scss';
import { CardType } from '@/types';

type Props = { card: CardType };

const Card = ({ card }: Props) => {
  const colors = ['#16a34a', '#f97316', '#dc2626', '#2563eb', '#7c3aed', '#d97706'];

  const getTagColor = (tag: string) => {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          {card.image_url ? (
            <Image
              src={card.image_url}
              alt="Avatar"
              width={24}
              height={24}
            />
          ) : (
            <Image
              src="/images/addUser.png" // ✅ fallback image
              alt="Default Avatar"
              width={24}
              height={24}
            />
          )}
        </div>
        <div className={styles.userDetails}>
          <p className={styles.userName}>{card.name || 'Unknown'}</p>
          <p className={styles.userTitle}>{card.designation || '-'}</p>
        </div>
        <div>
          <Image src="/images/dots.png" alt="Edit" width={16} height={16} />
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.userEmail}>
          <Image src="/images/email.png" alt="Email" width={16} height={16} />
          <p className={styles.email}>{card.email || '-'}</p>
        </div>
        <div className={styles.userContact}>
          <Image src="/images/phone.png" alt="Phone" width={16} height={16} />
          <p className={styles.contact}>{card.phone || '-'}</p>
        </div>
      </div>

      <div className={styles.userTags}>
        {card.tags && card.tags.map((tag, index) => {
          const color = getTagColor(tag);
          return (
            <div
              key={index}
              className={styles.userTag}
              style={{
                color: color,
                background: `${color}1A`,
              }}
            >
              {tag}
            </div>
          );
        })}
        <div className={styles.addTag}>
          <Image src="/images/add.png" alt="Tag" width={16} height={16} />
          Add tag
        </div>
      </div>
    </div>
  );
};

export default Card;
