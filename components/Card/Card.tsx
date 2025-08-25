'use client'
import Image from 'next/image'
import styles from './Card.module.scss'
import { CardType, Tag } from '@/types'
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
import { axios_instance } from '@/lib/axios'
import { AxiosError } from 'axios'

type Props = {
  card: CardType
  availableTags: Tag[]
  onDragStart: (list_id: number, card_id: number) => void
  onDragEnd: () => void
  onDragEnter: (listId: number, cardIndex: number) => void
  list_id: number
  index: number
  onCardUpdated?: (updatedCard: CardType) => void
  onCardDeleted?: (listId: number, cardId: number) => void
  onTagUpdate?: () => void
}

const Card = ({
  card,
  availableTags,
  onDragStart,
  onDragEnd,
  onDragEnter,
  index,
  list_id,
  onCardUpdated,
  onCardDeleted,
  onTagUpdate
}: Props) => {
  const [imageError, setImageError] = useState<boolean>(false)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editedCard, setEditedCard] = useState<CardType>(card)
  const [uploading, setUploading] = useState<boolean>(false)
  const [isTagSearchOpen, setIsTagSearchOpen] = useState<boolean>(false)
  const [tagSearchQuery, setTagSearchQuery] = useState<string>('')

  useEffect(() => {
    setEditedCard(card)
    setImageError(false)
  }, [card])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
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

  const handleImageError = (): void => setImageError(true)

  const toggleMenu = (): void => setShowMenu(!showMenu)

  const handleTagToggle = async (tagID: number, tagName: string): Promise<void> => {
    const currentTags = editedCard.tags || []
    const isSelected = currentTags.includes(tagName)

    try {
      if (isSelected) {
        await removeTagFromCard(tagID, card.id)
        const newTags = currentTags.filter(tag => tag !== tagName)
        const updatedCard = { ...editedCard, tags: newTags }
        setEditedCard(updatedCard)
        onCardUpdated?.(updatedCard)
      } else {
        await addTagToCard(tagID, card.id)
        const newTags = [...currentTags, tagName]
        const updatedCard = { ...editedCard, tags: newTags }
        setEditedCard(updatedCard)
        onCardUpdated?.(updatedCard)
      }
      onTagUpdate?.()
    } catch (error) {
      console.error('Tag toggle failed:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setEditedCard(prev => ({ ...prev, [name]: value }))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
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
      } finally {
        setUploading(false)
      }
    }

    reader.onerror = () => {
      console.error('File reading failed')
      setUploading(false)
    }
  }

  const handleSave = async (): Promise<void> => {
    setShowMenu(false)
    setIsEditing(false)

    if (JSON.stringify(editedCard) === JSON.stringify(card)) {
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
      setEditedCard(card)
    }
  }

  const handleDelete = async (): Promise<void> => {
    setShowMenu(false)
    try {
      const token = localStorage.getItem('token')
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/card/${card.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      onCardDeleted?.(list_id, card.id)
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const filteredTags = availableTags?.filter(tag =>
    tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase())
  )

  const addTagToCard = async (tagID: number, cardID: number): Promise<void> => {
    try {
      await axios_instance.post('/tag/add-to-card', { 
        tag_id: tagID, 
        card_id: cardID 
      })
    } catch (err) {
      const error = err as AxiosError
      console.error('Add Tag Error:', error?.response?.data || error)
      throw err
    }
  }

  const removeTagFromCard = async (tagID: number, cardID: number): Promise<void> => {
    try {
      await axios_instance.post('/tag/remove-from-card', { 
        tag_id: tagID, 
        card_id: cardID 
      })
    } catch (err) {
      const error = err as AxiosError
      console.error('Remove Tag Error:', error?.response?.data || error)
      throw err
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
                <div className={styles.uploadingText}></div>
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
                <div className={styles.avatarPlaceholder}>
                  {editedCard.name?.charAt(0).toUpperCase()}
                </div>
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
                placeholder='Name...'
                className={styles.userName}
                autoFocus
              />
              <input
                type='text'
                name='designation'
                value={editedCard.designation || ''}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder='Professional experience...'
                className={styles.userTitle}
              />
            </>
          ) : (
            <>
              <p className={styles.userName}>
                {editedCard.name || (
                  <span className={styles.placeholder}>Name...</span>
                )}
              </p>
              <p className={styles.userTitle}>
                {editedCard.designation || (
                  <span className={styles.placeholder}>
                    Professional experience...
                  </span>
                )}
              </p>
            </>
          )}
        </div>
        <div
          className={styles.userEdit}
          onClick={isEditing ? handleSave : toggleMenu}
        >
          {isEditing ? (
            <Checkmark width={24} height={24} fill='#194EFF' />
          ) : (
            <Dots width={24} height={24} fill='#3D3D3D' />
          )}

          {showMenu && !isEditing && (
            <div className={styles.userMenu}>
              <div
                className={styles.editMenu}
                onClick={() => {
                  setIsEditing(true)
                  setShowMenu(false)
                }}
              >
                <Edit width={16} height={16} fill='#00020F' />
                <div className={styles.editText}>Edit</div>
              </div>

              <div onClick={handleDelete} className={styles.deleteButton}>
                <Delete width={16} height={16} fill='#FB7285' />
                <div className={styles.deleteText}>Delete</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.cardContent}>
        {isEditing ? (
          <>
            <div className={styles.inputGroup}>
              <Mail width={16} height={16} fill='#3D3D3D' />
              <input
                type='email'
                name='email'
                value={editedCard.email || ''}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder='Email...'
                className={styles.contactInput}
              />
            </div>
            <div className={styles.inputGroup}>
              <Phone width={16} height={16} fill='#3D3D3D' />
              <input
                type='tel'
                name='phone'
                value={editedCard.phone || ''}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder='Phone...'
                className={styles.contactInput}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles.contactInfo}>
              <Mail width={16} height={12} fill='#3D3D3D' />
              <p className={styles.email}>
                {editedCard.email || (
                  <span className={styles.placeholder}>Email...</span>
                )}
              </p>
            </div>
            <div className={styles.contactInfo}>
              <Phone width={16} height={16} fill='#3D3D3D' />
              <p className={styles.contact}>
                {editedCard.phone || (
                  <span className={styles.placeholder}>Phone...</span>
                )}
              </p>
            </div>
          </>
        )}
      </div>

      <div className={styles.userTags}>
        {editedCard.tags && editedCard.tags.length > 0 && editedCard.tags.map((tagName, index) => {
          if (typeof tagName !== 'string') return null
          
          const tagObject = availableTags.find(t => t.name === tagName)
          const color = tagObject ? tagObject.color : '#808080'

          return (
            <div
              key={`${card.id}-tag-${index}`}
              className={styles.userTag}
              style={{ backgroundColor: color }}
            >
              {tagName}
            </div>
          )
        })}
        <div
          className={styles.addTag}
          onClick={() => setIsTagSearchOpen(!isTagSearchOpen)}
        >
          <Add width={16} height={16} />
          <p className={styles.addTagText}>Add tag</p>
        </div>
      </div>

      {isTagSearchOpen && (
        <div className={styles.searchTag}>
          <input
            type='text'
            placeholder='Search tags...'
            className={styles.searchTagInput}
            value={tagSearchQuery}
            onChange={e => setTagSearchQuery(e.target.value)}
            autoFocus
          />
          <div className={styles.allTags}>
            {filteredTags && filteredTags.length > 0 && filteredTags.map(tag => {
              const isSelected = (editedCard.tags || []).includes(tag.name)
              return (
                <div key={tag.id} className={styles.allTag} onClick={() => handleTagToggle(tag.id, tag.name)}>
                  <div
                    className={`${styles.checkbox} ${
                      isSelected ? styles.checked : ''
                    }`}
                  >
                    {isSelected && <Checkmark width={16} height={16} fill='white' />}
                  </div>
                  <div
                    className={styles.tagName}
                    style={{ backgroundColor: tag.color }}
                  >
                    <p className={styles.tagNameText}>{tag.name}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Card
