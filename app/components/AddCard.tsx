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
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name || !title || !email || !contact || !listId) return

    if (!email.endsWith('@gmail.com')) {
      alert('Email must end with @gmail.com')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/card/create`, {
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
          image_url: 'https://lh3.googleusercontent.com/a/ACg8ocJw2xWE84QKYmFuzKTPglJM75nl3SFjohtEvDSkVy1thdiTDaeS6g=s96-c',
          list_id: listId,
        }),
      })

      if (response.ok) {
        const jsonResponse = await response.json()
        const data = jsonResponse.data 

        const newCard: CardType = {
          id: data.id,
          name: data.name,
          designation: data.designation,
          email: data.email,
          phone: data.phone,
          image_url: data.image_url || 'https://lh3.googleusercontent.com/a/ACg8ocJw2xWE84QKYmFuzKTPglJM75nl3SFjohtEvDSkVy1thdiTDaeS6g=s96-c',
          list_id: data.list_id,
          created_at: data.created_at,
          updated_at: data.updated_at,
        }

        if (onCardAdded) onCardAdded(newCard)
        setName('')
        setTitle('')
        setEmail('')
        setContact('')
      } else {
        console.error('Failed to create card')
        alert('Failed to add the new card. Please try again.')
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred. Please try again.')
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
    </div>
  )
}

export default AddCard