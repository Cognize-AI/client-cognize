'use client';
import Image from 'next/image';
import styles from './Card.module.scss';
import { CardType } from '@/types';
import { useState } from 'react';

type Props = { card: CardType };

const Card = ({ card }: Props) => {
  const [imageError, setImageError] = useState(false);
  const colors = ['#16a34a', '#f97316', '#dc2626', '#2563eb', '#7c3aed', '#d97706'];

  const getTagColor = (tag: string) => {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (!card || !card.name) {
    return null;
  }

  return (
    <div className={styles.cardContainer}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          {card.image_url && !imageError ? (
            <Image
              src={card.image_url}
              alt="Avatar"
              width={40}
              height={40}
              className={styles.avatarImage}
              onError={handleImageError}
              unoptimized={true}
              priority={true}
            />
          ) : (
            <Image
              src="/images/User.png"
              alt="Default Avatar"
              width={48}
              height={48}
              className={styles.avatarImage}
            />
          )}
        </div>
        <div className={styles.userDetails}>
          <p className={styles.userName}>{card.name}</p>
          <p className={styles.userTitle}>{card.designation || '-'}</p>
        </div>
        <div className={styles.userEdit}>
          <Image src="/images/dots.png" alt="Edit" width={24} height={24} />
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.userEmail}>
          <Image src="/images/email.png" alt="Email" width={16} height={12} />
          <p className={styles.email}>{card.email || '-'}</p>
        </div>
        <div className={styles.userContact}>
          <Image src="/images/phone.png" alt="Phone" width={16} height={16} />
          <p className={styles.contact}>{card.phone || '-'}</p>
        </div>
      </div>

      <div className={styles.userTags}>
        {card.tags?.map((tag, index) => {
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
          <Image src="/images/addTag.png" alt="Tag" width={16} height={16} className={styles.addTagIcon} />
          <p className={styles.addTagText}>Add tag...</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
