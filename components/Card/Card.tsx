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
import { axios_instance } from '@/lib/axios'

type Props = {
  card: CardType
  tags: Tag[]
  onDragStart: (list_id: number, card_id: number) => void
  onDragEnd: () => void
  onDragEnter: (listId: number, cardIndex: number) => void
  list_id: number
  index: number
  onCardUpdated?: (updatedCard: CardType) => void
  onCardDeleted?: (cardId: number) => void
  onTagUpdate?: () => void
}

type Tag = {
  id: number
  name: string
  color: string
}

type CardTag = string | { name: string } | unknown

const Card = ({
  card,
  tags,
  onDragStart,
  onDragEnd,
  onDragEnter,
  index,
  list_id,
  onCardUpdated,
  onCardDeleted,
  onTagUpdate
}: Props) => {
  const [imageError, setImageError] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedCard, setEditedCard] = useState<CardType>(card)
  const [uploading, setUploading] = useState(false)
  const [isTagSearchOpen, setIsTagSearchOpen] = useState(false)
  const [tagSearchQuery, setTagSearchQuery] = useState('')

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

  const handleImageError = () => setImageError(true)

  const toggleMenu = () => setShowMenu(!showMenu)

  const getTagName = (cardTag: CardTag): string => {
    if (typeof cardTag === 'string') return cardTag
    if (cardTag && typeof cardTag === 'object' && 'name' in cardTag) {
      return (cardTag as { name: string }).name
    }
    return String(cardTag)
  }

  const handleTagToggle = async (tagID: number, tagName: string) => {
    const currentTags = editedCard.tags || []
    const isSelected = currentTags.some((cardTag: CardTag) => {
      return getTagName(cardTag) === tagName
    })

    if (isSelected) {
      removeTagFromCard(
        tagID,
        card.id,
        () => {
          const newTags = currentTags.filter((cardTag: CardTag) => {
            return getTagName(cardTag) !== tagName
          })
          const updatedCard = { ...editedCard, tags: newTags }
          setEditedCard(updatedCard)
          onCardUpdated?.(updatedCard)
          onTagUpdate?.()
        },
        () => {
          console.error('Failed to remove tag')
        }
      )
    } else {
      addTagToCard(
        tagID,
        card.id,
        () => {
          const updatedCard = {
            ...editedCard,
            tags: [...currentTags, tagName]
          }
          setEditedCard(updatedCard)
          onCardUpdated?.(updatedCard)
          onTagUpdate?.()
        },
        () => {
          console.error('Failed to add tag')
        }
      )
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
      } finally {
        setUploading(false)
      }
    }

    reader.onerror = () => {
      console.error('File reading failed')
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
    }
  }

  const handleDelete = async () => {
    setShowMenu(false)

    try {
      const token = localStorage.getItem('token')
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/card/${card.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      onCardDeleted?.(card.id)
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const filteredTags = tags?.filter(tag =>
    tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase())
  )

  const addTagToCard = (
    tagID: number,
    cardID: number,
    onSuccess: () => void,
    onError: () => void
  ) => {
    if (!tagID || !cardID) return

    axios_instance
      .post('/tag/add-to-card', {
        tag_id: tagID,
        card_id: cardID
      })
      .then(() => onSuccess())
      .catch(err => {
        console.error('Add Tag Error:', err?.response?.data || err)
        onError()
      })
  }

  const removeTagFromCard = (
    tagID: number,
    cardID: number,
    onSuccess: () => void,
    onError: () => void
  ) => {
    if (!tagID || !cardID) return

    axios_instance
      .post(`/tag/remove-from-card`, {
        tag_id: tagID,
        card_id: cardID
      })
      .then(() => onSuccess())
      .catch(err => {
        console.error('Remove Tag Error:', err?.response?.data || err)
        onError()
      })
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

        {/* --- MODIFIED LINE --- */}
        <div
          className={styles.userEdit}
          onClick={isEditing ? handleSave : toggleMenu}
        >
          {!isEditing ? (
            <Dots width={24} height={24} fill='#3D3D3D' />
          ) : (
            <Checkmark width={24} height={24} fill='#194EFF' />
          )}

          {showMenu && !isEditing && (
            <div className={styles.userMenu}>
              <div
                className={styles.editMenu}
                // --- RECOMMENDED CHANGE: Close menu on click ---
                onClick={() => {
                  setIsEditing(true)
                  setShowMenu(false)
                }}
              >
                <div className={styles.edit}>
                  <Edit width={16} height={16} fill='#00020F' />
                </div>
                <div className={styles.editText}>Edit</div>
              </div>

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

      <div className={styles.userTags}>
        {editedCard.tags?.map((tag, index) => {
          const tagName = getTagName(tag)
          const tagObject = tags.find(t => t.name === tagName)
          const color = tagObject ? tagObject.color : '#808080'

          return (
            <div
              key={`${card.id}-tag-${index}`}
              className={styles.userTag}
              style={{
                color: color,
                backgroundColor: `${color}0A`
              }}
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
          <p className={styles.addTagText}>Add tag...</p>
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
          />
          <div className={styles.allTags}>
            {filteredTags?.map(tag => {
              const currentTags = editedCard.tags || []
              const isSelected = currentTags.some((cardTag: CardTag) => {
                return getTagName(cardTag) === tag.name
              })

              return (
                <div key={tag.id} className={styles.allTag}>
                  <div
                    className={`${styles.checkbox} ${
                      isSelected ? styles.checked : ''
                    }`}
                    onClick={() => handleTagToggle(tag.id, tag.name)}
                  >
                    {isSelected ? (
                      <Checkmark width={12} height={12} fill='white' />
                    ) : (
                      <Checkmark width={12} height={12} fill='white' />
                    )}
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