'use client'
import Image from 'next/image'
import styles from './AddCard.module.scss'
import { useState } from 'react'
import { CardType } from '../kanban/page'

type Props = {
  listId?: number
  onCardAdded?: (newCard: CardType) => void
}

const AddCard = ({ listId, onCardAdded }: Props) => {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [email, setEmail] = useState('')
  const [contact, setContact] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagColors, setTagColors] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)

  const colors = ['#16a34a', '#f97316', '#dc2626', '#2563eb', '#7c3aed', '#d97706']

  const handleSubmit = async () => {
    if (!name || !title || !email || !contact || !listId) return

    if (!email.endsWith('@gmail.com')) {
      alert('Email must end with @gmail.com')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/card/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : ''
          },
          body: JSON.stringify({
            name,
            designation: title,
            email,
            phone: contact,
            image_url:'',
              // 'https://lh3.googleusercontent.com/a/ACg8ocJw2xWE84QKYmFuzKTPglJM75nl3SFjohtEvDSkVy1thdiTDaeS6g=s96-c',
            list_id: listId,
            tags
          })
        }
      )

      if (response.ok) {
        const jsonResponse = await response.json()
        const data = jsonResponse.data

        const newCard: CardType = {
          id: data.id,
          name: data.name,
          designation: data.designation,
          email: data.email,
          phone: data.phone,
          image_url:
            data.image_url,
            // 'https://lh3.googleusercontent.com/a/ACg8ocJw2xWE84QKYmFuzKTPglJM75nl3SFjohtEvDSkVy1thdiTDaeS6g=s96-c'
          list_id: data.list_id,
          created_at: data.created_at,
          updated_at: data.updated_at,
          tags: data.tags || []
        }

        if (onCardAdded) onCardAdded(newCard)
        setName('')
        setTitle('')
        setEmail('')
        setContact('')
        setTags([])
        setTagColors([])
        setTagInput('')

        window.location.reload()
      } else {
        alert('Failed to add the new card. Please try again.')
      }
    } catch (err) {
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      setTags(prev => [...prev, trimmed])
      setTagColors(prev => [...prev, randomColor])
      setTagInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className={styles.cardContainer}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          <Image src='/images/add.png' alt='Avatar' width={24} height={24} />
        </div>
        <div className={styles.userDetails}>
          <input
            type='text'
            placeholder='Enter Name'
            value={name}
            onChange={e => setName(e.target.value)}
            className={styles.userName}
          />
          <input
            type='text'
            placeholder='Enter Title'
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={styles.userTitle}
          />
        </div>
        <div className={styles.userActions}>
          <Image
            src='/images/tick.png'
            alt='Submit'
            width={22}
            height={14}
            style={{ cursor: 'pointer' }}
            onClick={handleSubmit}
          />
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.userEmail}>
          <Image src='/images/email.png' alt='Email' width={16} height={16} />
          <input
            type='email'
            placeholder='Enter Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={styles.email}
          />
        </div>
        <div className={styles.userContact}>
          <Image src='/images/phone.png' alt='Phone' width={16} height={16} />
          <input
            type='text'
            placeholder='Enter Contact'
            value={contact}
            onChange={e => setContact(e.target.value)}
            className={styles.contact}
          />
        </div>
      </div>

      <div className={styles.userTags}>
        {tags.map((tag, idx) => (
          <div
            key={idx}
            className={styles.userTag}
            style={{
              color: tagColors[idx],
              background: `${tagColors[idx]}0A`
            }}
          >
            {tag}
          </div>
        ))}
        <div className={styles.addTag}>
          <Image src='/images/add.png' alt='Tag' width={16} height={16} />
          <input
            type='text'
            placeholder='Add tag'
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleAddTag}
            className={styles.tagInput}
          />
        </div>
      </div>
    </div>
  )
}

export default AddCard
