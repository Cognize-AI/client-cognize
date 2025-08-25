'use client'
import Image from 'next/image'
import styles from './Card.module.scss'
import { CardType } from '@/types'
import { useEffect, useState } from 'react'
import { Add, AddImage, Delete, Dots, Edit, Mail, Phone } from '../icons'

type Props = {
  card: CardType
  onDragStart: (list_id: number, card_id: number) => void
  onDragEnd: () => void
  onDragEnter: (listId: number, cardIndex: number) => void
  list_id: number
  index: number
  onCardUpdated?: (updatedCard: CardType) => void
  onCardDeleted?: (cardId: number) => void
}

const Card = ({
  card,
  onDragStart,
  onDragEnd,
  onDragEnter,
  index,
  list_id,
  onCardUpdated,
  onCardDeleted
}: Props) => {
  const [imageError, setImageError] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedCard, setEditedCard] = useState<CardType>(card)
  const [uploading, setUploading] = useState(false)

  const colors = ['#16a34a', '#f97316', '#dc2626', '#2563eb', '#7c3aed', '#d97706']

  useEffect(() => {
    setEditedCard(card)
    setImageError(false)
  }, [card])

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

  const handleImageError = () => setImageError(true)

  const toggleMenu = () => setShowMenu(!showMenu)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedCard(prev => ({ ...prev, [name]: value }))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
  }

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      )
      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error('Image upload failed:', error)
      throw error
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const imageUrl = await uploadToCloudinary(file)
      setEditedCard(prev => ({ ...prev, image_url: imageUrl }))
      setImageError(false)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload image.')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setShowMenu(false)
    setIsEditing(false)

    if (
      editedCard.name === card.name &&
      editedCard.email === card.email &&
      editedCard.phone === card.phone &&
      editedCard.designation === card.designation &&
      editedCard.image_url === card.image_url
    ) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/card/${card.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(editedCard)
        }
      )
      if (!res.ok) throw new Error('Failed to update card')

      const updated = await res.json()
      onCardUpdated?.(updated.data)
    } catch (error) {
      console.error('Edit failed:', error)
      alert('Failed to edit card.')
    }
  }

  const handleDelete = async () => {
    setShowMenu(false)
    if (!confirm('Are you sure you want to delete this card?')) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/card/${card.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (!res.ok) throw new Error('Failed to delete card')

      onCardDeleted?.(card.id)
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete card.')
    }
  }

  return (
    <div
      className={`${styles.cardContainer} ${isEditing ? styles.editing : ''}`}
      draggable={!isEditing}
      onDragStart={() => !isEditing && onDragStart(list_id, card.id)}
      onDragEnter={() => !isEditing && onDragEnter(list_id, index)}
      onDragEnd={onDragEnd}
    >
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          {isEditing ? (
            <label htmlFor={`file-upload-${card.id}`} className={styles.avatarUpload}>
              {uploading ? (
                <div className={styles.uploadingText}>...</div>
              ) : editedCard.image_url && !imageError ? (
                <Image
                  src={editedCard.image_url}
                  alt="Avatar"
                  width={40}
                  height={40}
                  className={styles.avatarImage}
                  onError={handleImageError}
                  quality={100}
                />
              ) : (
                <AddImage width={24} height={24} fill="#BCBBB8" />
              )}
              <input
                id={`file-upload-${card.id}`}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.hiddenInput}
                disabled={uploading}
              />
            </label>
          ) : (
            <>
              {editedCard.image_url && !imageError ? (
                <Image
                  src={editedCard.image_url}
                  alt="Avatar"
                  width={40}
                  height={40}
                  className={styles.avatarImage}
                  onError={handleImageError}
                  quality={100}
                />
              ) : (
                <AddImage width={24} height={24} fill="#BCBBB8" />
              )}
            </>
          )}
        </div>

        <div className={styles.userDetails}>
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={editedCard.name || ''}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="name..."
                className={styles.userName}
              />
              <input
                type="text"
                name="designation"
                value={editedCard.designation || ''}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="professional exp..."
                className={styles.userTitle}
              />
            </>
          ) : (
            <>
              <p className={styles.userName}>
                {editedCard.name || <span className={styles.userNamePlaceholder}>name...</span>}
              </p>
              <p className={styles.userTitle}>
                {editedCard.designation || <span className={styles.userTitlePlaceholder}>professional exp...</span>}
              </p>
            </>
          )}
        </div>

        <div className={styles.userEdit} onClick={toggleMenu}>
          <Dots width={24} height={24} fill="#3D3D3D" />

          {showMenu && (
            <div className={styles.userMenu}>
              {!isEditing ? (
                <div className={styles.editMenu} onClick={() => setIsEditing(true)}>
                  <div className={styles.edit}>
                    <Edit width={16} height={16} fill="#00020F" />
                  </div>
                  <div className={styles.editText}>Edit</div>
                </div>
              ) : (
                <div className={styles.editMenu} onClick={handleSave}>
                  <div className={styles.edit}>
                    <Edit width={16} height={16} fill="#00020F" />
                  </div>
                  <div className={styles.editText}>Save</div>
                </div>
              )}
              <div onClick={handleDelete} className={styles.deleteButton}>
                <div className={styles.delete}>
                  <Delete width={16} height={16} fill="#FB7285" />
                </div>
                <div className={styles.deleteText}>Delete</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.cardContent}>
        {isEditing ? (
          <>
            <div className={styles.userEmail}>
              <Mail width={16} height={12} fill="#3D3D3D" />
              <input
                type="text"
                name="email"
                value={editedCard.email || ''}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="email..."
                className={styles.email}
              />
            </div>
            <div className={styles.userContact}>
              <Phone width={16} height={16} fill="#3D3D3D" />
              <input
                type="text"
                name="phone"
                value={editedCard.phone || ''}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="phone..."
                className={styles.contact}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles.userEmail}>
              <Mail width={16} height={12} fill="#3D3D3D" />
              <p className={styles.email}>
                {editedCard.email || <span className={styles.emailPlaceholder}>email...</span>}
              </p>
            </div>
            <div className={styles.userContact}>
              <Phone width={16} height={16} fill="#3D3D3D" />
              <p className={styles.contact}>
                {editedCard.phone || <span className={styles.contactPlaceholder}>phone...</span>}
              </p>
            </div>
          </>
        )}
      </div>

      {!isEditing && (
        <div className={styles.userTags}>
          {editedCard.tags?.map((tag, index) => {
            const color = tag.color
            return (
              <div
                key={index}
                className={styles.userTag}
                style={{
                  color: color,
                  background: `${color}1A`
                }}
              >
                {tag?.name}
              </div>
            )
          })}
          <div className={styles.addTag}>
            <Add width={16} height={16} />
            <p className={styles.addTagText}>Add tag...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Card
