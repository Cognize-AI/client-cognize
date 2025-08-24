'use client'
import Image from 'next/image'
import styles from './Card.module.scss'
import { CardType } from '@/types'
import { useEffect, useState } from 'react'
import {
  Add,
  AddImage,
  Checkmark,
  Delete,
  Dots,
  Edit,
  Mail,
  Phone
} from '../icons'

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

type Tag = {
  id: number
  name: string
  color: string
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
  const [isTagSearchOpen, setIsTagSearchOpen] = useState(false)
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [isLoadingTags, setIsLoadingTags] = useState(false)

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
      if (
        isTagSearchOpen &&
        !target.closest(`.${styles.addTag}`) &&
        !target.closest(`.${styles.searchTag}`)
      ) {
        setIsTagSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu, isTagSearchOpen])

  // Fetches all available tags when the component first loads
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoadingTags(true)
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tag`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (!res.ok) throw new Error('Failed to fetch tags')
        const data = await res.json()
        setAvailableTags(data.data.tags)
      } catch (error) {
        console.error('Failed to fetch tags:', error)
      } finally {
        setIsLoadingTags(false)
      }
    }
    fetchTags()
  }, []) // Empty array ensures this runs only once on mount

  const handleImageError = () => setImageError(true)

  const toggleMenu = () => setShowMenu(!showMenu)

  const handleTagToggle = async (tagName: string) => {
    const currentTags = editedCard.tags || []
    const newTags = currentTags.includes(tagName)
      ? currentTags.filter(t => t !== tagName)
      : [...currentTags, tagName]

    const updatedCardData = { ...editedCard, tags: newTags }
    setEditedCard(updatedCardData)

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
          body: JSON.stringify(updatedCardData)
        }
      )

      if (!res.ok) throw new Error('Failed to update card tags')
      const updated = await res.json()
      onCardUpdated?.(updated.data)
    } catch (error) {
      console.error('Tag update failed:', error)
      alert('Failed to update tags.')
      setEditedCard(card)
    }
  }

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onloadend = async () => {
      try {
        const base64data = reader.result
        const token = localStorage.getItem('token')
        const res = await fetch(`/api/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ image: base64data })
        })

        if (!res.ok) throw new Error('Upload failed')
        const data = await res.json()
        if (!data.url) throw new Error('Upload response did not contain a URL')

        setEditedCard(prev => ({ ...prev, image_url: data.url }))
        setImageError(false)
      } catch (error) {
        console.error('Upload failed:', error)
        alert('Failed to upload image.')
      } finally {
        setUploading(false)
      }
    }

    reader.onerror = () => {
      console.error('File reading failed')
      alert('Failed to read the image file.')
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
      editedCard.image_url === card.image_url &&
      JSON.stringify(editedCard.tags) === JSON.stringify(card.tags)
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
            <label
              htmlFor={`file-upload-${card.id}`}
              className={styles.avatarUpload}
            >
              {uploading ? (
                <div className={styles.uploadingText}>...</div>
              ) : editedCard.image_url && !imageError ? (
                <Image
                  src={editedCard.image_url}
                  alt='Avatar'
                  width={40}
                  height={40}
                  className={styles.avatarImage}
                  onError={handleImageError}
                  quality={100}
                />
              ) : (
                <AddImage width={24} height={24} fill='#BCBBB8' />
              )}
              <input
                id={`file-upload-${card.id}`}
                type='file'
                accept='image/*'
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
                  alt='Avatar'
                  width={40}
                  height={40}
                  className={styles.avatarImage}
                  onError={handleImageError}
                  quality={100}
                />
              ) : (
                <AddImage width={24} height={24} fill='#BCBBB8' />
              )}
            </>
          )}
        </div>

        <div className={styles.userDetails}>
          {isEditing ? (
            <>
              <input
                type='text'
                name='name'
                value={editedCard.name || ''}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder='name...'
                className={styles.userName}
              />
              <input
                type='text'
                name='designation'
                value={editedCard.designation || ''}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder='professional exp...'
                className={styles.userTitle}
              />
            </>
          ) : (
            <>
              <p className={styles.userName}>
                {editedCard.name || (
                  <span className={styles.userNamePlaceholder}>name...</span>
                )}
              </p>
              <p className={styles.userTitle}>
                {editedCard.designation || (
                  <span className={styles.userTitlePlaceholder}>
                    professional exp...
                  </span>
                )}
              </p>
            </>
          )}
        </div>

        <div className={styles.userEdit} onClick={toggleMenu}>
          <Dots width={24} height={24} fill='#3D3D3D' />
          {showMenu && (
            <div className={styles.userMenu}>
              {!isEditing ? (
                <div
                  className={styles.editMenu}
                  onClick={() => setIsEditing(true)}
                >
                  <div className={styles.edit}>
                    <Edit width={16} height={16} fill='#00020F' />
                  </div>
                  <div className={styles.editText}>Edit</div>
                </div>
              ) : (
                <div className={styles.editMenu} onClick={handleSave}>
                  <div className={styles.edit}>
                    <Edit width={16} height={16} fill='#00020F' />
                  </div>
                  <div className={styles.editText}>Save</div>
                </div>
              )}
              <div onClick={handleDelete} className={styles.deleteButton}>
                <div className={styles.delete}>
                  <Delete width={16} height={16} fill='#FB7285' />
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
              <Mail width={16} height={12} fill='#3D3D3D' />
              <input
                type='text'
                name='email'
                value={editedCard.email || ''}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder='email...'
                className={styles.email}
              />
            </div>
            <div className={styles.userContact}>
              <Phone width={16} height={16} fill='#3D3D3D' />
              <input
                type='text'
                name='phone'
                value={editedCard.phone || ''}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder='phone...'
                className={styles.contact}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles.userEmail}>
              <Mail width={16} height={12} fill='#3D3D3D' />
              <p className={styles.email}>
                {editedCard.email || (
                  <span className={styles.emailPlaceholder}>email...</span>
                )}
              </p>
            </div>
            <div className={styles.userContact}>
              <Phone width={16} height={16} fill='#3D3D3D' />
              <p className={styles.contact}>
                {editedCard.phone || (
                  <span className={styles.contactPlaceholder}>phone...</span>
                )}
              </p>
            </div>
          </>
        )}
      </div>

      {!isEditing && (
        <div className={styles.userTags}>
          {editedCard.tags?.map((tagName, index) => {
            const tagObject = availableTags.find(t => t.name === tagName);
            // Use a gray fallback color while tags are loading or if not found
            const color = tagObject ? tagObject.color : '#808080';

            return (
              <div
                key={index}
                className={styles.userTag}
                style={{
                  color: '#FFFFFF',
                  backgroundColor: color
                }}
              >
                {tagName}
              </div>
            );
          })}
          <div
            className={styles.addTag}
            onClick={() => setIsTagSearchOpen(!isTagSearchOpen)}
          >
            <Add width={16} height={16} />
            <p className={styles.addTagText}>Add tag...</p>
          </div>
          {isTagSearchOpen && (
            <div className={styles.searchTag}>
              <input
                type='text'
                placeholder='Search tags...'
                className={styles.searchTagInput}
              />
              <div className={styles.allTags}>
                {isLoadingTags ? (
                  <p>Loading tags...</p>
                ) : (
                  availableTags?.map(tag => {
                    const isSelected = (editedCard.tags || []).includes(
                      tag.name
                    );
                    return (
                      <div key={tag.id} className={styles.allTag}>
                        <div
                          className={`${styles.checkbox} ${
                            isSelected ? styles.checked : ''
                          }`}
                          onClick={() => handleTagToggle(tag.name)}
                        >
                          {isSelected && (
                            <Checkmark width={12} height={12} fill='white' />
                          )}
                        </div>
                        <div
                          className={styles.tagName}
                          style={{ backgroundColor: tag.color }}
                        >
                          <p className={styles.tagNameText}>{tag.name}</p>
                          <Edit width={16} height={16} fill='white' />
                          <Delete width={16} height={16} fill='white' />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;