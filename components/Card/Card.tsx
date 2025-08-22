'use client'
import Image from 'next/image'
import styles from './Card.module.scss'
import { CardType } from '@/types'
import { useEffect, useState } from 'react'

type Props = {
  card: CardType
  onDragStart: (list_id: number, card_id: number) => void
  onDragEnd: () => void
  onDragEnter: (listId: number, cardIndex: number) => void
  list_id: number,
  index: number
}

const Card = ({ card, onDragStart, onDragEnd, onDragEnter, index, list_id }: Props) => {
  const [imageError, setImageError] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const colors = [
    '#16a34a',
    '#f97316',
    '#dc2626',
    '#2563eb',
    '#7c3aed',
    '#d97706'
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showMenu && !target.closest(`.${styles.userEdit}`)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu])

  const getTagColor = (tag: string) => {
    let hash = 0
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash % colors.length)
    return colors[index]
  }

  const handleImageError = () => {
    setImageError(true)
  }

  if (!card || !card.name) {
    return null
  }

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  const handleEdit = () => {
    console.log('Edit clicked')
    setShowMenu(false)
  }

  const handleDelete = () => {
    console.log('Delete clicked')
    setShowMenu(false)
  }

  return (
    <div
      className={styles.cardContainer}
      draggable
      onDragStart={() => onDragStart(list_id, card.id)}
      onDragEnter={() => onDragEnter(list_id, index)}
      onDragEnd={onDragEnd}
    >
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          {card.image_url && !imageError ? (
            <Image
              src={card.image_url}
              alt='Avatar'
              width={40}
              height={40}
              className={styles.avatarImage}
              onError={handleImageError}
              quality={100}
            />
          ) : (
            <Image
              src='/images/User.png'
              alt='Default Avatar'
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
        <div className={styles.userEdit} onClick={toggleMenu}>
          <Image src='/images/dots.png' alt='Edit' width={24} height={24} />

          {showMenu && (
            <div className={styles.menu}>
              <div className={styles.menuItem} onClick={handleEdit}>
                <span className={styles.menuText}>Edit</span>
              </div>
              <div className={styles.menuItem} onClick={handleDelete}>
                <span className={styles.menuTextDelete}>Delete</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.userEmail}>
          <Image src='/images/email.png' alt='Email' width={16} height={12} />
          <p className={styles.email}>{card.email || '-'}</p>
        </div>
        <div className={styles.userContact}>
          <Image src='/images/phone.png' alt='Phone' width={16} height={16} />
          <p className={styles.contact}>{card.phone || '-'}</p>
        </div>
      </div>

      <div className={styles.userTags}>
        {card.tags?.map((tag, index) => {
          const color = getTagColor(tag)
          return (
            <div
              key={index}
              className={styles.userTag}
              style={{
                color: color,
                background: `${color}1A`
              }}
            >
              {tag}
            </div>
          )
        })}
        <div className={styles.addTag}>
          <Image
            src='/images/addTag.png'
            alt='Tag'
            width={16}
            height={16}
            className={styles.addTagIcon}
          />
          <p className={styles.addTagText}>Add tag...</p>
        </div>
      </div>
    </div>
  )
}

export default Card
