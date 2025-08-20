'use client'
import Image from 'next/image'
import styles from './AddCard.module.scss'
import { useState } from 'react'

type Props = {
  listId?: number
  onCardAdded?: () => void
}

const AddCard = ({ listId, onCardAdded }: Props) => {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [email, setEmail] = useState('')
  const [contact, setContact] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleSubmit = async () => {
    if (!name || !title || !email || !contact) return
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8080/card/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          name,
          designation: title,
          email,
          phone: contact,
          listID: listId,
        }),
      })

      if (response.ok) {
        setName('')
        setTitle('')
        setEmail('')
        setContact('')
        setTags([])
        if (onCardAdded) onCardAdded()
      } else if (response.status === 401) {
        console.error('Unauthorized. Please login first.')
      } else {
        console.error('Failed to create card')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
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
            className={styles.userName}
            placeholder='Enter Name'
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            type='text'
            className={styles.userTitle}
            placeholder='Enter Title'
            value={title}
            onChange={e => setTitle(e.target.value)}
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
            className={styles.email}
            placeholder='Enter Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.userContact}>
          <Image src='/images/phone.png' alt='Phone' width={16} height={16} />
          <input
            type='text'
            className={styles.contact}
            placeholder='Enter Contact'
            value={contact}
            onChange={e => setContact(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.userTags}>
        {tags.map((tag, index) => (
          <div key={index} className={styles.userTag}>
            {tag}
          </div>
        ))}
        <div className={styles.addTag} onClick={handleAddTag}>
          <Image src='/images/add.png' alt='Add' width={16} height={16} />
          <p className={styles.tag}>Add tag</p>
        </div>
      </div>
    </div>
  )
}

export default AddCard
