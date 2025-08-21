'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' 
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
  tags: string
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter() 

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/signin') 
          return
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/list/all`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include'
        })

        if (!res.ok) throw new Error('Failed to fetch lists')

        const json = await res.json()
        const existingLists = json.data.lists

        if (existingLists && existingLists.length > 0) {
          setLists(existingLists)
        } else {
          const defaultRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/list/create-default`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include'
          });
          if (!defaultRes.ok) throw new Error('Failed to fetch default lists');
          
          const defaultJson = await defaultRes.json();
          setLists(defaultJson.data.lists || []);
        }

      } catch (err) {
        console.error(err)
        setError('Could not load the board. Please try again later.....') 
      } finally {
        setLoading(false) 
      }
    }

    fetchLists()
  }, [router])

  const handleCardAdded = (newCard: CardType) => {
    setLists(prevLists =>
      prevLists.map(list => {
        if (list.id === newCard.list_id) {
          const updatedCards = list.cards ? [...list.cards, newCard] : [newCard]
          return { ...list, cards: updatedCards }
        }
        return list
      })
    )
  }
  
  if (loading) {
    return <p className={styles.message}>Loading board...</p>
  }

  if (error) {
    return <p className={styles.message}>{error}</p>
  }

  

  return (
    <div className={styles.kanbanPage}>
      <Header />
      <div className={styles.kanbanLists}>
        {lists.map(list =>
          list ? <List key={list.id} list={list} onCardAdded={handleCardAdded} /> : null
        )}
      </div>
    </div>
  )
}

export default Page