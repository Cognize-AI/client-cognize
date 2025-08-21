'use client'
import { useEffect, useState } from 'react'
import Header from '../components/header'
import List from '../components/list'
import styles from './page.module.scss'

export type CardType = {
  id: number
  name: string
  designation: string
  email: string
  phone: string
  image_url: string
  list_id: number
  created_at: string
  updated_at: string
}

export type ListType = {
  id: number
  name: string
  color: string
  list_order: number
  created_at: string
  updated_at: string
  cards: CardType[] | null
}

const Page = () => {
  const [lists, setLists] = useState<ListType[]>([])

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          window.location.href = '/signin'
          return
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/list/all`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include'
        })

        if (!res.ok) throw new Error('Failed to fetch lists')

        const json = await res.json()
        setLists(json.data.lists || [])
      } catch (err) {
        console.error(err)
      }
    }

    fetchLists()
  }, [])

  const handleCardAdded = (newCard: CardType) => {
    setLists(prevLists =>
      prevLists.map(list => {
        if (list.id === newCard.list_id) {
          const updatedCards = [...(list.cards || []), newCard]
          return { ...list, cards: updatedCards }
        }
        return list
      })
    )
  }

  return (
    <div className={styles.kanbanPage}>
      <Header />
      <div className={styles.kanbanLists}>
        {lists.length > 0 ? (
          lists.map(list =>
            list ? <List key={list.id} list={list} onCardAdded={handleCardAdded} /> : null
          )
        ) : (
          <p>No lists available</p>
        )}
      </div>
    </div>
  )
}

export default Page